using Junkfroot.LoyaltyService.Data;
using Junkfroot.LoyaltyService.Domain;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LoyaltyService.Consumers;

public record OrderCompletedEvent
{
    public Guid OrderId { get; init; }
    public Guid UserId { get; init; }
    public string OrderNumber { get; init; } = string.Empty;
    public decimal Total { get; init; }
    public int ItemCount { get; init; }
    public DateTime CompletedAt { get; init; }
}

public class OrderCompletedConsumer(
    LoyaltyDbContext db,
    ILogger<OrderCompletedConsumer> logger) : IConsumer<OrderCompletedEvent>
{
    private const decimal MinimumQualifyingAmount = 8.00m;
    private const int PunchesForFreeJuice = 8;

    public async Task Consume(ConsumeContext<OrderCompletedEvent> context)
    {
        var message = context.Message;

        logger.LogInformation(
            "Processing OrderCompleted event for order {OrderNumber}, user {UserId}, total {Total}",
            message.OrderNumber, message.UserId, message.Total);

        // Only punch for qualifying orders (minimum $8 spend)
        if (message.Total < MinimumQualifyingAmount)
        {
            logger.LogInformation(
                "Order {OrderNumber} total {Total} is below minimum {Minimum}, skipping punch",
                message.OrderNumber, message.Total, MinimumQualifyingAmount);
            return;
        }

        // Find or create loyalty card
        var card = await db.LoyaltyCards
            .FirstOrDefaultAsync(c => c.UserId == message.UserId);

        if (card is null)
        {
            card = new LoyaltyCard
            {
                Id = Guid.NewGuid(),
                UserId = message.UserId,
                ReferralCode = GenerateReferralCode()
            };
            db.LoyaltyCards.Add(card);
        }

        // Check for duplicate punch (idempotency)
        var existingPunch = await db.Punches
            .AnyAsync(p => p.OrderId == message.OrderId);

        if (existingPunch)
        {
            logger.LogWarning("Duplicate punch detected for order {OrderId}, skipping", message.OrderId);
            return;
        }

        // Add punch
        var punch = new Punch
        {
            Id = Guid.NewGuid(),
            LoyaltyCardId = card.Id,
            OrderId = message.OrderId,
            OrderNumber = message.OrderNumber,
            OrderTotal = message.Total,
            PunchedAt = DateTime.UtcNow
        };

        db.Punches.Add(punch);
        card.TotalPunches++;
        card.CurrentPunches++;

        // Check if free juice earned
        if (card.CurrentPunches >= PunchesForFreeJuice)
        {
            card.FreeJuicesEarned++;
            card.CurrentPunches -= PunchesForFreeJuice;
            logger.LogInformation("User {UserId} earned a free juice! Total earned: {Count}",
                message.UserId, card.FreeJuicesEarned);
        }

        card.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        logger.LogInformation(
            "Punch added for user {UserId}, current punches: {Current}/{Required}",
            message.UserId, card.CurrentPunches, PunchesForFreeJuice);
    }

    private static string GenerateReferralCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = Random.Shared;
        return "JF-" + new string(Enumerable.Range(0, 6).Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }
}
