namespace Junkfroot.LoyaltyService.Domain;

public class Punch
{
    public Guid Id { get; set; }
    public Guid LoyaltyCardId { get; set; }
    public LoyaltyCard LoyaltyCard { get; set; } = null!;
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal OrderTotal { get; set; }
    public DateTime PunchedAt { get; set; } = DateTime.UtcNow;
}
