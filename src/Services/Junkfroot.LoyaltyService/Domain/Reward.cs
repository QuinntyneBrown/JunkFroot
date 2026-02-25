namespace Junkfroot.LoyaltyService.Domain;

public class Reward
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public RewardType Type { get; set; }
    public int PunchesRequired { get; set; }
    public decimal? DiscountAmount { get; set; }
    public bool IsActive { get; set; } = true;
    public List<RewardRedemption> Redemptions { get; set; } = [];
}

public class RewardRedemption
{
    public Guid Id { get; set; }
    public Guid RewardId { get; set; }
    public Reward Reward { get; set; } = null!;
    public Guid UserId { get; set; }
    public Guid LoyaltyCardId { get; set; }
    public DateTime RedeemedAt { get; set; } = DateTime.UtcNow;
}

public enum RewardType
{
    FreeJuice,
    Discount,
    BirthdayFreebie,
    ReferralDiscount
}
