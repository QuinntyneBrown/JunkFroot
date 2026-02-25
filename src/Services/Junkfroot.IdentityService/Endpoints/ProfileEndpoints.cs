using System.Security.Claims;
using Junkfroot.IdentityService.Data;
using Junkfroot.IdentityService.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.IdentityService.Endpoints;

public static class ProfileEndpoints
{
    public static void MapProfileEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/profile")
            .WithTags("Profile")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, UserManager<AppUser> userManager, IdentityDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var appUser = await userManager.FindByIdAsync(userId.ToString());

            if (appUser is null) return Results.NotFound();

            var profile = await db.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            var roles = await userManager.GetRolesAsync(appUser);

            return Results.Ok(new ProfileResponse(
                appUser.Id,
                appUser.Email!,
                appUser.FirstName,
                appUser.LastName,
                profile?.Birthday,
                profile?.AvatarUrl,
                profile?.FavouriteProduct,
                profile?.DietaryPreferences ?? [],
                profile?.Allergies ?? [],
                profile?.MarketingOptIn ?? false,
                roles.ToList()
            ));
        })
        .WithName("GetProfile")
        .Produces<ProfileResponse>()
        .Produces(404);

        group.MapPut("/", async (
            UpdateProfileRequest request,
            ClaimsPrincipal user,
            UserManager<AppUser> userManager,
            IdentityDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var appUser = await userManager.FindByIdAsync(userId.ToString());

            if (appUser is null) return Results.NotFound();

            if (request.FirstName is not null) appUser.FirstName = request.FirstName;
            if (request.LastName is not null) appUser.LastName = request.LastName;
            appUser.UpdatedAt = DateTime.UtcNow;

            await userManager.UpdateAsync(appUser);

            var profile = await db.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile is not null)
            {
                if (request.Birthday.HasValue) profile.Birthday = request.Birthday.Value;
                if (request.FavouriteProduct is not null) profile.FavouriteProduct = request.FavouriteProduct;
                if (request.DietaryPreferences is not null) profile.DietaryPreferences = request.DietaryPreferences;
                if (request.Allergies is not null) profile.Allergies = request.Allergies;
                if (request.MarketingOptIn.HasValue) profile.MarketingOptIn = request.MarketingOptIn.Value;
                profile.UpdatedAt = DateTime.UtcNow;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new { Message = "Profile updated" });
        })
        .WithName("UpdateProfile")
        .Produces(404);

        group.MapPost("/avatar", async (
            HttpRequest httpRequest,
            ClaimsPrincipal user,
            IdentityDbContext db) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var profile = await db.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile is null) return Results.NotFound();

            // In production, upload to Azure Blob Storage / MinIO
            // For now, store a placeholder URL
            profile.AvatarUrl = $"/avatars/{userId}/{Guid.NewGuid()}.jpg";
            profile.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(new { AvatarUrl = profile.AvatarUrl });
        })
        .WithName("UploadAvatar")
        .Produces(404)
        .DisableAntiforgery();
    }
}

public record ProfileResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    DateOnly? Birthday,
    string? AvatarUrl,
    string? FavouriteProduct,
    List<string> DietaryPreferences,
    List<string> Allergies,
    bool MarketingOptIn,
    List<string> Roles);

public record UpdateProfileRequest(
    string? FirstName = null,
    string? LastName = null,
    DateOnly? Birthday = null,
    string? FavouriteProduct = null,
    List<string>? DietaryPreferences = null,
    List<string>? Allergies = null,
    bool? MarketingOptIn = null);
