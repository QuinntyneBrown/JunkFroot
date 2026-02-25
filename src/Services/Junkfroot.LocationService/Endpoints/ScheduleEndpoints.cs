using Junkfroot.LocationService.Data;
using Junkfroot.LocationService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LocationService.Endpoints;

public static class ScheduleEndpoints
{
    public static void MapScheduleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/schedule").WithTags("Schedule");

        group.MapGet("/", async (LocationDbContext db) =>
        {
            var schedules = await db.OperatingSchedules
                .Where(s => !s.IsClosed)
                .OrderBy(s => s.DayOfWeek)
                .ToListAsync();

            return Results.Ok(schedules);
        })
        .WithName("GetSchedule")
        .Produces<List<OperatingSchedule>>();

        group.MapGet("/today", async (LocationDbContext db) =>
        {
            var easternZone = TimeZoneInfo.FindSystemTimeZoneById("America/Toronto");
            var today = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, easternZone).DayOfWeek;

            var schedule = await db.OperatingSchedules
                .FirstOrDefaultAsync(s => s.DayOfWeek == today);

            if (schedule is null)
                return Results.Ok(new { Message = "No schedule for today", IsClosed = true });

            if (schedule.IsClosed)
                return Results.Ok(new
                {
                    Message = $"Closed today: {schedule.ClosedReason}",
                    IsClosed = true,
                    schedule.ClosedReason
                });

            return Results.Ok(new
            {
                schedule.DayOfWeek,
                schedule.LocationName,
                schedule.Address,
                schedule.OpenTime,
                schedule.CloseTime,
                schedule.Latitude,
                schedule.Longitude,
                IsClosed = false
            });
        })
        .WithName("GetTodaySchedule");
    }
}
