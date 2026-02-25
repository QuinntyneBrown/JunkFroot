using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Junkfroot.IdentityService.Data;
using Junkfroot.IdentityService.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Junkfroot.IdentityService.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/").WithTags("Authentication");

        group.MapPost("/register", async (
            RegisterRequest request,
            UserManager<AppUser> userManager,
            IdentityDbContext db,
            IConfiguration config) =>
        {
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser is not null)
                return Results.Conflict(new { Error = "A user with this email already exists" });

            var user = new AppUser
            {
                Id = Guid.NewGuid(),
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return Results.BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await userManager.AddToRoleAsync(user, Roles.Customer);

            // Create customer profile
            var profile = new CustomerProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Birthday = request.Birthday,
                MarketingOptIn = request.MarketingOptIn
            };
            db.CustomerProfiles.Add(profile);
            await db.SaveChangesAsync();

            var tokens = await GenerateTokens(user, userManager, config, db);

            return Results.Created("/profile", new AuthResponse(
                tokens.AccessToken,
                tokens.RefreshToken,
                tokens.ExpiresAt,
                user.Id,
                user.Email!,
                $"{user.FirstName} {user.LastName}",
                [Roles.Customer]
            ));
        })
        .WithName("Register")
        .Produces<AuthResponse>(201)
        .Produces(400)
        .Produces(409);

        group.MapPost("/login", async (
            LoginRequest request,
            UserManager<AppUser> userManager,
            IdentityDbContext db,
            IConfiguration config) =>
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user is null)
                return Results.Unauthorized();

            var passwordValid = await userManager.CheckPasswordAsync(user, request.Password);
            if (!passwordValid)
                return Results.Unauthorized();

            var roles = await userManager.GetRolesAsync(user);
            var tokens = await GenerateTokens(user, userManager, config, db);

            return Results.Ok(new AuthResponse(
                tokens.AccessToken,
                tokens.RefreshToken,
                tokens.ExpiresAt,
                user.Id,
                user.Email!,
                $"{user.FirstName} {user.LastName}",
                roles.ToList()
            ));
        })
        .WithName("Login")
        .Produces<AuthResponse>()
        .Produces(401);

        group.MapPost("/refresh", async (
            RefreshRequest request,
            UserManager<AppUser> userManager,
            IdentityDbContext db,
            IConfiguration config) =>
        {
            var refreshToken = await db.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == request.RefreshToken && !t.IsRevoked);

            if (refreshToken is null || refreshToken.ExpiresAt < DateTime.UtcNow)
                return Results.Unauthorized();

            // Revoke old refresh token
            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;

            var user = refreshToken.User;
            var tokens = await GenerateTokens(user, userManager, config, db);
            var roles = await userManager.GetRolesAsync(user);

            return Results.Ok(new AuthResponse(
                tokens.AccessToken,
                tokens.RefreshToken,
                tokens.ExpiresAt,
                user.Id,
                user.Email!,
                $"{user.FirstName} {user.LastName}",
                roles.ToList()
            ));
        })
        .WithName("RefreshToken")
        .Produces<AuthResponse>()
        .Produces(401);
    }

    private static async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)> GenerateTokens(
        AppUser user,
        UserManager<AppUser> userManager,
        IConfiguration config,
        IdentityDbContext db)
    {
        var roles = await userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        // Add loyalty_id claim if profile exists
        var profile = await db.CustomerProfiles.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (profile is not null)
        {
            claims.Add(new Claim("loyalty_id", profile.Id.ToString()));
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(config["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT signing key is not configured.")));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTime.UtcNow.AddHours(1);

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"] ?? "junkfroot-identity",
            audience: config["Jwt:Audience"] ?? "junkfroot-api",
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        // Generate refresh token
        var refreshTokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var refreshToken = new Domain.RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        db.RefreshTokens.Add(refreshToken);
        await db.SaveChangesAsync();

        return (accessToken, refreshTokenValue, expiresAt);
    }
}

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    DateOnly? Birthday = null,
    bool MarketingOptIn = false);

public record LoginRequest(string Email, string Password);

public record RefreshRequest(string RefreshToken);

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    Guid UserId,
    string Email,
    string Name,
    List<string> Roles);
