namespace Junkfroot.LocationService.Domain;

public class TruckLocation
{
    public Guid Id { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Address { get; set; }
    public string? LocationName { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? EstimatedCloseTime { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid? UpdatedByUserId { get; set; }
}

public class TruckLocationUpdate
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Address { get; set; }
    public string? LocationName { get; set; }
    public bool IsActive { get; set; }
    public DateTime? EstimatedCloseTime { get; set; }
    public DateTime UpdatedAt { get; set; }
}
