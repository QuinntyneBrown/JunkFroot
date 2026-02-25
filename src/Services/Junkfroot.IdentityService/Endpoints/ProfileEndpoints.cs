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
            IdentityDbContext db,
            Azure.Storage.Blobs.BlobServiceClient blobServiceClient) =>
        {
            var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var profile = await db.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile is null) return Results.NotFound();

            var form = await httpRequest.ReadFormAsync();
            var file = form.Files.GetFile("avatar");

            if (file is null || file.Length == 0)
                return Results.BadRequest(new { Error = "No file provided" });

            if (file.Length > 5 * 1024 * 1024)
                return Results.BadRequest(new { Error = "File size exceeds 5MB limit" });

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType))
                return Results.BadRequest(new { Error = "Only JPEG, PNG, and WebP images are allowed" });

            var containerClient = blobServiceClient.GetBlobContainerClient("avatars");
            await containerClient.CreateIfNotExistsAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

            var extension = Path.GetExtension(file.FileName) ?? ".jpg";
            var blobName = $"{userId}/{Guid.NewGuid()}{extension}";
            var blobClient = containerClient.GetBlobClient(blobName);

            await using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, new Azure.Storage.Blobs.Models.BlobHttpHeaders
            {
                ContentType = file.ContentType
            });

            profile.AvatarUrl = blobClient.Uri.ToString();
            profile.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(new { AvatarUrl = profile.AvatarUrl });
        })
        .WithName("UploadAvatar")
        .Produces(400)
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
