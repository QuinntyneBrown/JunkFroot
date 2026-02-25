namespace Junkfroot.OrderService.Domain;

public class Order
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public OrderType Type { get; set; } = OrderType.Pickup;
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Total { get; set; }
    public string? Notes { get; set; }
    public string? PickupLocation { get; set; }
    public DateTime? PickupTime { get; set; }
    public List<OrderItem> Items { get; set; } = [];
    public Payment? Payment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Preparing,
    Ready,
    Completed,
    Cancelled
}

public enum OrderType
{
    Pickup,
    Delivery,
    Catering
}
