namespace Junkfroot.LoyaltyService.Domain;

public class Referral
{
    public Guid Id { get; set; }
    public Guid ReferrerUserId { get; set; }
    public Guid RefereeUserId { get; set; }
    public string ReferralCode { get; set; } = string.Empty;
    public ReferralStatus Status { get; set; } = ReferralStatus.Pending;
    public bool ReferrerRewarded { get; set; }
    public bool RefereeRewarded { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}

public enum ReferralStatus
{
    Pending,
    Completed,
    Expired
}
