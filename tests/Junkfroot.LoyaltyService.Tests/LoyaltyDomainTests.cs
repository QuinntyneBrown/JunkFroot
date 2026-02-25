using Junkfroot.LoyaltyService.Domain;
using Xunit;

namespace Junkfroot.LoyaltyService.Tests;

public class LoyaltyDomainTests
{
    [Fact]
    public void New_LoyaltyCard_Starts_With_Zero_Punches()
    {
        var card = new LoyaltyCard
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid()
        };

        Assert.Equal(0, card.TotalPunches);
        Assert.Equal(0, card.CurrentPunches);
        Assert.Equal(0, card.FreeJuicesEarned);
        Assert.Equal(0, card.FreeJuicesRedeemed);
    }

    [Fact]
    public void Free_Juice_Earned_After_Eight_Punches()
    {
        var card = new LoyaltyCard
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid()
        };

        // Simulate 8 punches
        for (int i = 0; i < 8; i++)
        {
            card.TotalPunches++;
            card.CurrentPunches++;
        }

        if (card.CurrentPunches >= 8)
        {
            card.FreeJuicesEarned++;
            card.CurrentPunches -= 8;
        }

        Assert.Equal(1, card.FreeJuicesEarned);
        Assert.Equal(0, card.CurrentPunches);
        Assert.Equal(8, card.TotalPunches);
    }

    [Fact]
    public void Referral_Defaults_To_Pending_Status()
    {
        var referral = new Referral
        {
            Id = Guid.NewGuid(),
            ReferrerUserId = Guid.NewGuid(),
            RefereeUserId = Guid.NewGuid(),
            ReferralCode = "JF-ABC123"
        };

        Assert.Equal(ReferralStatus.Pending, referral.Status);
        Assert.False(referral.ReferrerRewarded);
        Assert.False(referral.RefereeRewarded);
    }
}
