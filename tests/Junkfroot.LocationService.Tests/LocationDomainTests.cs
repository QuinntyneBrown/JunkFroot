using Junkfroot.LocationService.Domain;
using Xunit;

namespace Junkfroot.LocationService.Tests;

public class LocationDomainTests
{
    [Fact]
    public void TruckLocation_Defaults_To_Active()
    {
        var location = new TruckLocation
        {
            Id = Guid.NewGuid(),
            Latitude = 43.6525,
            Longitude = -79.3832
        };

        Assert.True(location.IsActive);
    }

    [Fact]
    public void EventBooking_Defaults_To_Pending_Status()
    {
        var booking = new EventBooking
        {
            Id = Guid.NewGuid(),
            EventName = "Caribana Festival",
            Location = "Exhibition Place",
            EventDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            StartTime = new TimeOnly(10, 0),
            EndTime = new TimeOnly(20, 0),
            Type = EventType.Festival
        };

        Assert.Equal(EventStatus.Pending, booking.Status);
    }

    [Fact]
    public void CateringRequest_Defaults_To_New_Status()
    {
        var request = new CateringRequest
        {
            Id = Guid.NewGuid(),
            ContactName = "Test User",
            ContactEmail = "test@example.com",
            EventDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14)),
            Headcount = 50,
            EventType = "Corporate"
        };

        Assert.Equal(CateringStatus.New, request.Status);
    }
}
