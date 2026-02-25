namespace Junkfroot.OrderService.Domain;

public record OrderCompletedEvent
{
    public Guid OrderId { get; init; }
    public Guid UserId { get; init; }
    public string OrderNumber { get; init; } = string.Empty;
    public decimal Total { get; init; }
    public int ItemCount { get; init; }
    public DateTime CompletedAt { get; init; }
}

public record OrderCreatedEvent
{
    public Guid OrderId { get; init; }
    public Guid UserId { get; init; }
    public string OrderNumber { get; init; } = string.Empty;
    public decimal Total { get; init; }
    public DateTime CreatedAt { get; init; }
}
