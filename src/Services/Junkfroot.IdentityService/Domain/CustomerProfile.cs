namespace Junkfroot.IdentityService.Domain;

public class CustomerProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;
    public DateOnly? Birthday { get; set; }
    public string? AvatarUrl { get; set; }
    public string? FavouriteProduct { get; set; }
    public List<string> DietaryPreferences { get; set; } = [];
    public List<string> Allergies { get; set; } = [];
    public bool MarketingOptIn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
