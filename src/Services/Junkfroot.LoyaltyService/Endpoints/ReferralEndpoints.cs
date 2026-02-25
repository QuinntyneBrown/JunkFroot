using System.Security.Claims;
using Junkfroot.LoyaltyService.Data;
using Junkfroot.LoyaltyService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LoyaltyService.Endpoints;

public static class ReferralEndpoints
{
    public static void MapReferralEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/referral")
            .WithTags("Referrals")
            .RequireAuthorization();

        group.MapGet("/code", async (ClaimsPrincipal user, LoyaltyDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var card = await db.LoyaltyCards.FirstOrDefaultAsync(c => c.UserId == userId);
            if (card is null)
                return Results.NotFound(new { Error = "No loyalty card found" });

            return Results.Ok(new
            {
                card.ReferralCode,
                card.ReferralCount,
                ShareMessage = $"Join the Froot Fam! Use my code {card.ReferralCode} and we both get $3 off. 🍉🥭"
            });
        })
        .WithName("GetReferralCode")
        .Produces(404);

        group.MapPost("/apply", async (
            ApplyReferralRequest request,
            ClaimsPrincipal user,
            LoyaltyDbContext db) =>
        {
            var refereeUserId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Find the referrer's loyalty card by referral code
            var referrerCard = await db.LoyaltyCards
                .FirstOrDefaultAsync(c => c.ReferralCode == request.ReferralCode);

            if (referrerCard is null)
                return Results.BadRequest(new { Error = "Invalid referral code" });

            if (referrerCard.UserId == refereeUserId)
                return Results.BadRequest(new { Error = "Cannot refer yourself" });

            // Check if referral already exists
            var existingReferral = await db.Referrals
                .AnyAsync(r => r.ReferrerUserId == referrerCard.UserId && r.RefereeUserId == refereeUserId);

            if (existingReferral)
                return Results.BadRequest(new { Error = "Referral already applied" });

            var referral = new Referral
            {
                Id = Guid.NewGuid(),
                ReferrerUserId = referrerCard.UserId,
                RefereeUserId = refereeUserId,
                ReferralCode = request.ReferralCode,
                Status = ReferralStatus.Completed,
                ReferrerRewarded = true,
                RefereeRewarded = true,
                CompletedAt = DateTime.UtcNow
            };

            db.Referrals.Add(referral);

            referrerCard.ReferralCount++;
            referrerCard.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                Message = "Referral applied! You both get $3 off your next order.",
                referral.Id
            });
        })
        .WithName("ApplyReferral")
        .Produces(400);
    }
}

public record ApplyReferralRequest(string ReferralCode);
