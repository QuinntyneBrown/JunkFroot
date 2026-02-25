using Junkfroot.OrderService.Domain;
using MassTransit;

namespace Junkfroot.OrderService.Services;

public class OrderEventPublisher(IPublishEndpoint publishEndpoint, ILogger<OrderEventPublisher> logger)
{
    public async Task PublishOrderCompleted(Order order)
    {
        var @event = new OrderCompletedEvent
        {
            OrderId = order.Id,
            UserId = order.UserId,
            OrderNumber = order.OrderNumber,
            Total = order.Total,
            ItemCount = order.Items.Count,
            CompletedAt = DateTime.UtcNow
        };

        await publishEndpoint.Publish(@event);
        logger.LogInformation("Published OrderCompleted event for order {OrderNumber}", order.OrderNumber);
    }

    public async Task PublishOrderCreated(Order order)
    {
        var @event = new OrderCreatedEvent
        {
            OrderId = order.Id,
            UserId = order.UserId,
            OrderNumber = order.OrderNumber,
            Total = order.Total,
            CreatedAt = DateTime.UtcNow
        };

        await publishEndpoint.Publish(@event);
        logger.LogInformation("Published OrderCreated event for order {OrderNumber}", order.OrderNumber);
    }
}
