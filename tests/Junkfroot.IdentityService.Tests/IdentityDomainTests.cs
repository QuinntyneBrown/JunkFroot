using Junkfroot.IdentityService.Domain;
using Xunit;

namespace Junkfroot.IdentityService.Tests;

public class IdentityDomainTests
{
    [Fact]
    public void Roles_Constants_Are_Defined()
    {
        Assert.Equal("Customer", Roles.Customer);
        Assert.Equal("Operator", Roles.Operator);
        Assert.Equal("Admin", Roles.Admin);
    }

    [Fact]
    public void AppUser_Has_Required_Properties()
    {
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            FirstName = "Keisha",
            LastName = "Thompson",
            Email = "keisha@example.com",
            UserName = "keisha@example.com"
        };

        Assert.Equal("Keisha", user.FirstName);
        Assert.Equal("Thompson", user.LastName);
        Assert.NotEqual(default, user.CreatedAt);
    }

    [Fact]
    public void CustomerProfile_Defaults_Are_Correct()
    {
        var profile = new CustomerProfile
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid()
        };

        Assert.False(profile.MarketingOptIn);
        Assert.Empty(profile.DietaryPreferences);
        Assert.Empty(profile.Allergies);
        Assert.Null(profile.Birthday);
    }
}
