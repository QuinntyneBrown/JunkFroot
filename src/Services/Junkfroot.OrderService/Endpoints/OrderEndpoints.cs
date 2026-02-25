using System.Security.Claims;
using Junkfroot.OrderService.Data;
using Junkfroot.OrderService.Domain;
using Junkfroot.OrderService.Services;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.OrderService.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/orders")
            .WithTags("Orders")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, OrderDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var orders = await db.Orders
                .Include(o => o.Items)
                .Include(o => o.Payment)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Results.Ok(orders);
        })
        .WithName("GetOrders")
        .Produces<List<Order>>();

        group.MapGet("/{id:guid}", async (Guid id, ClaimsPrincipal user, OrderDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var order = await db.Orders
                .Include(o => o.Items)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            return order is null ? Results.NotFound() : Results.Ok(order);
        })
        .WithName("GetOrderById")
        .Produces<Order>()
        .Produces(404);

        group.MapGet("/{id:guid}/status", async (Guid id, ClaimsPrincipal user, OrderDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var order = await db.Orders
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order is null) return Results.NotFound();

            return Results.Ok(new { order.Id, order.OrderNumber, order.Status, order.UpdatedAt });
        })
        .WithName("GetOrderStatus")
        .Produces(404);
    }
}
