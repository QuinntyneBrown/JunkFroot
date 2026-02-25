using Junkfroot.LocationService.Data;
using Junkfroot.LocationService.Domain;
using Junkfroot.LocationService.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Junkfroot.LocationService.Endpoints;

public static class TruckLocationEndpoints
{
    public static void MapTruckLocationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/truck").WithTags("Truck Location");

        group.MapGet("/current", async (LocationDbContext db) =>
        {
            var location = await db.TruckLocations
                .OrderByDescending(l => l.UpdatedAt)
                .FirstOrDefaultAsync();

            if (location is null)
                return Results.NotFound(new { Error = "No truck location available" });

            return Results.Ok(new
            {
                location.Latitude,
                location.Longitude,
                location.Address,
                location.LocationName,
                location.IsActive,
                location.EstimatedCloseTime,
                location.UpdatedAt
            });
        })
        .WithName("GetCurrentLocation")
        .Produces(404);

        group.MapPost("/update", async (
            UpdateLocationRequest request,
            ClaimsPrincipal user,
            LocationDbContext db,
            IHubContext<TruckLocationHub> hubContext) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var location = new TruckLocation
            {
                Id = Guid.NewGuid(),
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Address = request.Address,
                LocationName = request.LocationName,
                IsActive = request.IsActive,
                EstimatedCloseTime = request.EstimatedCloseTime,
                UpdatedByUserId = userId
            };

            db.TruckLocations.Add(location);
            await db.SaveChangesAsync();

            // Push real-time update via SignalR
            var update = new TruckLocationUpdate
            {
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                Address = location.Address,
                LocationName = location.LocationName,
                IsActive = location.IsActive,
                EstimatedCloseTime = location.EstimatedCloseTime,
                UpdatedAt = location.UpdatedAt
            };

            await hubContext.Clients.All.SendAsync("LocationUpdated", update);

            return Results.Ok(location);
        })
        .WithName("UpdateTruckLocation")
        .RequireAuthorization("operator");
    }
}

public record UpdateLocationRequest(
    double Latitude,
    double Longitude,
    string? Address,
    string? LocationName,
    bool IsActive = true,
    DateTime? EstimatedCloseTime = null);
