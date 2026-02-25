using Junkfroot.LocationService.Data;
using Junkfroot.LocationService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LocationService.Endpoints;

public static class EventEndpoints
{
    public static void MapEventEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("").WithTags("Events & Catering");

        group.MapGet("/events", async (LocationDbContext db) =>
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var events = await db.EventBookings
                .Where(e => e.EventDate >= today && e.Status != EventStatus.Cancelled)
                .OrderBy(e => e.EventDate)
                .ThenBy(e => e.StartTime)
                .ToListAsync();

            return Results.Ok(events);
        })
        .WithName("GetEvents")
        .Produces<List<EventBooking>>();

        group.MapPost("/events", async (CreateEventRequest request, LocationDbContext db) =>
        {
            var eventBooking = new EventBooking
            {
                Id = Guid.NewGuid(),
                EventName = request.EventName,
                Description = request.Description,
                Type = request.Type,
                Location = request.Location,
                Address = request.Address,
                EventDate = request.EventDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                ExpectedHeadcount = request.ExpectedHeadcount,
                ContactName = request.ContactName,
                ContactEmail = request.ContactEmail,
                ContactPhone = request.ContactPhone,
                Notes = request.Notes,
                Status = EventStatus.Confirmed
            };

            db.EventBookings.Add(eventBooking);
            await db.SaveChangesAsync();

            return Results.Created($"/events/{eventBooking.Id}", eventBooking);
        })
        .WithName("CreateEvent")
        .RequireAuthorization("admin")
        .Produces<EventBooking>(201);

        group.MapPost("/catering/request", async (CateringInquiryRequest request, LocationDbContext db) =>
        {
            var cateringRequest = new CateringRequest
            {
                Id = Guid.NewGuid(),
                ContactName = request.ContactName,
                ContactEmail = request.ContactEmail,
                ContactPhone = request.ContactPhone,
                EventDate = request.EventDate,
                Headcount = request.Headcount,
                EventType = request.EventType,
                Message = request.Message,
                Status = CateringStatus.New
            };

            db.CateringRequests.Add(cateringRequest);
            await db.SaveChangesAsync();

            return Results.Created($"/catering/{cateringRequest.Id}", new
            {
                Message = "Catering inquiry received! We'll get back to you within 24 hours.",
                cateringRequest.Id
            });
        })
        .WithName("SubmitCateringInquiry")
        .Produces(201);
    }
}

public record CreateEventRequest(
    string EventName,
    string? Description,
    EventType Type,
    string Location,
    string? Address,
    DateOnly EventDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int? ExpectedHeadcount,
    string? ContactName,
    string? ContactEmail,
    string? ContactPhone,
    string? Notes);

public record CateringInquiryRequest(
    string ContactName,
    string ContactEmail,
    string? ContactPhone,
    DateOnly EventDate,
    int Headcount,
    string EventType,
    string? Message);
