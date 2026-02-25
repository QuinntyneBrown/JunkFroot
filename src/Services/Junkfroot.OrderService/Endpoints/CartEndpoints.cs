using System.Security.Claims;
using Junkfroot.OrderService.Data;
using Junkfroot.OrderService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.OrderService.Endpoints;

public static class CartEndpoints
{
    public static void MapCartEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/cart")
            .WithTags("Cart")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, OrderDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart is null)
            {
                cart = new Cart { Id = Guid.NewGuid(), UserId = userId };
                db.Carts.Add(cart);
                await db.SaveChangesAsync();
            }

            return Results.Ok(cart);
        })
        .WithName("GetCart")
        .Produces<Cart>();

        group.MapPost("/items", async (AddCartItemRequest request, ClaimsPrincipal user, OrderDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart is null)
            {
                cart = new Cart { Id = Guid.NewGuid(), UserId = userId };
                db.Carts.Add(cart);
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
            if (existingItem is not null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    Id = Guid.NewGuid(),
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    ProductName = request.ProductName,
                    UnitPrice = request.UnitPrice,
                    Quantity = request.Quantity,
                    Customization = request.Customization
                });
            }

            cart.Total = cart.Items.Sum(i => i.UnitPrice * i.Quantity);
            cart.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Results.Ok(cart);
        })
        .WithName("AddCartItem")
        .Produces<Cart>();

        group.MapPut("/items/{id:guid}", async (Guid id, UpdateCartItemRequest request, ClaimsPrincipal user, OrderDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart is null) return Results.NotFound();

            var item = cart.Items.FirstOrDefault(i => i.Id == id);
            if (item is null) return Results.NotFound();

            item.Quantity = request.Quantity;
            cart.Total = cart.Items.Sum(i => i.UnitPrice * i.Quantity);
            cart.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Results.Ok(cart);
        })
        .WithName("UpdateCartItem")
        .Produces<Cart>()
        .Produces(404);

        group.MapDelete("/items/{id:guid}", async (Guid id, ClaimsPrincipal user, OrderDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var cart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart is null) return Results.NotFound();

            var item = cart.Items.FirstOrDefault(i => i.Id == id);
            if (item is null) return Results.NotFound();

            cart.Items.Remove(item);
            cart.Total = cart.Items.Sum(i => i.UnitPrice * i.Quantity);
            cart.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Results.Ok(cart);
        })
        .WithName("RemoveCartItem")
        .Produces<Cart>()
        .Produces(404);
    }
}

public record AddCartItemRequest(
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity,
    string? Customization);

public record UpdateCartItemRequest(int Quantity);
