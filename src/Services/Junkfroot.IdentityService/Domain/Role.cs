using Microsoft.AspNetCore.Identity;

namespace Junkfroot.IdentityService.Domain;

public class AppRole : IdentityRole<Guid>
{
    public string? Description { get; set; }
}

public static class Roles
{
    public const string Customer = "Customer";
    public const string Operator = "Operator";
    public const string Admin = "Admin";
}
