using System.Security.Claims;
using Junkfroot.OrderService.Data;
using Junkfroot.OrderService.Domain;
using Junkfroot.OrderService.Services;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.OrderService.Endpoints;

public static class PaymentEndpoints
{
    public static void MapPaymentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/checkout")
            .WithTags("Checkout")
            .RequireAuthorization();

        group.MapPost("/", async (
            CheckoutRequest request,
            ClaimsPrincipal user,
            OrderDbContext db,
            PaymentService paymentService,
            OrderEventPublisher eventPublisher) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart is null || cart.Items.Count == 0)
                return Results.BadRequest("Cart is empty");

            var taxRate = 0.13m; // Ontario HST
            var subTotal = cart.Total;
            var taxAmount = subTotal * taxRate;
            var total = subTotal + taxAmount;

            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderNumber = GenerateOrderNumber(),
                Status = OrderStatus.Pending,
                Type = request.OrderType,
                SubTotal = subTotal,
                TaxAmount = taxAmount,
                Total = total,
                Notes = request.Notes,
                PickupLocation = request.PickupLocation,
                PickupTime = request.PickupTime,
                Items = cart.Items.Select(ci => new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = ci.ProductId,
                    ProductName = ci.ProductName,
                    UnitPrice = ci.UnitPrice,
                    Quantity = ci.Quantity,
                    LineTotal = ci.UnitPrice * ci.Quantity,
                    Customization = ci.Customization
                }).ToList()
            };

            var payment = await paymentService.ProcessPayment(order.Id, total, request.PaymentToken);

            if (payment.Status != PaymentStatus.Completed)
                return Results.BadRequest(new { Error = "Payment failed", Reason = payment.FailureReason });

            order.Payment = payment;
            order.Status = OrderStatus.Confirmed;

            db.Orders.Add(order);

            // Clear the cart
            db.CartItems.RemoveRange(cart.Items);
            cart.Items.Clear();
            cart.Total = 0;
            cart.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            await eventPublisher.PublishOrderCreated(order);

            return Results.Created($"/orders/{order.Id}", order);
        })
        .WithName("Checkout")
        .Produces<Order>(201)
        .Produces(400);
    }

    private static string GenerateOrderNumber()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var random = Random.Shared.Next(1000, 9999);
        return $"JF-{timestamp}-{random}";
    }
}

public record CheckoutRequest(
    string PaymentToken,
    OrderType OrderType = OrderType.Pickup,
    string? Notes = null,
    string? PickupLocation = null,
    DateTime? PickupTime = null);
