using System.Security.Claims;
using Junkfroot.LoyaltyService.Data;
using Junkfroot.LoyaltyService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LoyaltyService.Endpoints;

public static class LoyaltyEndpoints
{
    public static void MapLoyaltyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/card")
            .WithTags("Loyalty Card")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, LoyaltyDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var card = await db.LoyaltyCards
                .Include(c => c.Punches.OrderByDescending(p => p.PunchedAt).Take(10))
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (card is null)
            {
                // Auto-create loyalty card for new users
                card = new LoyaltyCard
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ReferralCode = GenerateReferralCode()
                };
                db.LoyaltyCards.Add(card);
                await db.SaveChangesAsync();
            }

            return Results.Ok(new LoyaltyCardResponse(
                card.Id,
                card.CurrentPunches,
                8, // PunchesRequired
                card.TotalPunches,
                card.FreeJuicesEarned,
                card.FreeJuicesRedeemed,
                card.FreeJuicesEarned - card.FreeJuicesRedeemed,
                card.ReferralCode!,
                card.ReferralCount,
                card.Punches.Select(p => new PunchResponse(p.Id, p.OrderNumber, p.OrderTotal, p.PunchedAt)).ToList()
            ));
        })
        .WithName("GetLoyaltyCard")
        .Produces<LoyaltyCardResponse>();

        group.MapGet("/history", async (ClaimsPrincipal user, LoyaltyDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var card = await db.LoyaltyCards
                .Include(c => c.Punches.OrderByDescending(p => p.PunchedAt))
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (card is null) return Results.NotFound();

            var redemptions = await db.RewardRedemptions
                .Include(r => r.Reward)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.RedeemedAt)
                .ToListAsync();

            return Results.Ok(new
            {
                Punches = card.Punches.Select(p => new PunchResponse(p.Id, p.OrderNumber, p.OrderTotal, p.PunchedAt)),
                Redemptions = redemptions.Select(r => new
                {
                    r.Id,
                    RewardName = r.Reward.Name,
                    r.RedeemedAt
                })
            });
        })
        .WithName("GetLoyaltyHistory")
        .Produces(404);
    }

    private static string GenerateReferralCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = Random.Shared;
        return "JF-" + new string(Enumerable.Range(0, 6).Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }
}

public record LoyaltyCardResponse(
    Guid Id,
    int CurrentPunches,
    int PunchesRequired,
    int TotalPunches,
    int FreeJuicesEarned,
    int FreeJuicesRedeemed,
    int FreeJuicesAvailable,
    string ReferralCode,
    int ReferralCount,
    List<PunchResponse> RecentPunches);

public record PunchResponse(Guid Id, string OrderNumber, decimal OrderTotal, DateTime PunchedAt);
