using System.Security.Claims;
using Junkfroot.LoyaltyService.Data;
using Junkfroot.LoyaltyService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LoyaltyService.Endpoints;

public static class RewardEndpoints
{
    public static void MapRewardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/rewards")
            .WithTags("Rewards")
            .RequireAuthorization();

        group.MapGet("/", async (LoyaltyDbContext db) =>
        {
            var rewards = await db.Rewards
                .Where(r => r.IsActive)
                .OrderBy(r => r.PunchesRequired)
                .ToListAsync();

            return Results.Ok(rewards);
        })
        .WithName("GetRewards")
        .Produces<List<Reward>>();

        group.MapPost("/{id:guid}/redeem", async (Guid id, ClaimsPrincipal user, LoyaltyDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var reward = await db.Rewards.FindAsync(id);
            if (reward is null || !reward.IsActive)
                return Results.NotFound();

            var card = await db.LoyaltyCards.FirstOrDefaultAsync(c => c.UserId == userId);
            if (card is null)
                return Results.BadRequest(new { Error = "No loyalty card found" });

            // Check eligibility based on reward type
            if (reward.Type == RewardType.FreeJuice)
            {
                var available = card.FreeJuicesEarned - card.FreeJuicesRedeemed;
                if (available <= 0)
                    return Results.BadRequest(new { Error = "No free juices available. Keep punching!" });

                card.FreeJuicesRedeemed++;
            }

            var redemption = new RewardRedemption
            {
                Id = Guid.NewGuid(),
                RewardId = reward.Id,
                UserId = userId,
                LoyaltyCardId = card.Id
            };

            db.RewardRedemptions.Add(redemption);
            card.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                Message = $"Reward '{reward.Name}' redeemed!",
                redemption.Id,
                RewardName = reward.Name,
                redemption.RedeemedAt
            });
        })
        .WithName("RedeemReward")
        .Produces(400)
        .Produces(404);
    }
}
