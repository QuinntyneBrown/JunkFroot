namespace Junkfroot.LoyaltyService.Domain;

public class LoyaltyCard
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int TotalPunches { get; set; }
    public int CurrentPunches { get; set; }
    public int FreeJuicesEarned { get; set; }
    public int FreeJuicesRedeemed { get; set; }
    public string? ReferralCode { get; set; }
    public int ReferralCount { get; set; }
    public List<Punch> Punches { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
