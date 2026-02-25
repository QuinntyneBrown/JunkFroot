namespace Junkfroot.LocationService.Domain;

public class EventBooking
{
    public Guid Id { get; set; }
    public string EventName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public EventType Type { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Address { get; set; }
    public DateOnly EventDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int? ExpectedHeadcount { get; set; }
    public string? ContactName { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? Notes { get; set; }
    public EventStatus Status { get; set; } = EventStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class CateringRequest
{
    public Guid Id { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public DateOnly EventDate { get; set; }
    public int Headcount { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string? Message { get; set; }
    public CateringStatus Status { get; set; } = CateringStatus.New;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum EventType
{
    Festival,
    Market,
    CorporateEvent,
    PrivateParty,
    Community,
    PopUp
}

public enum EventStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed
}

public enum CateringStatus
{
    New,
    Contacted,
    Quoted,
    Confirmed,
    Declined
}
