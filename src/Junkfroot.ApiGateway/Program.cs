using System.Text;
using System.Threading.RateLimiting;
using Junkfroot.ServiceDefaults;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// ── YARP Reverse Proxy ──────────────────────────────────────────
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// ── Authentication ──────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT signing key is not configured. Set 'Jwt:Key' via Aspire parameters.");

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "junkfroot-identity",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "junkfroot-api",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("authenticated", policy =>
        policy.RequireAuthenticatedUser());
    options.AddPolicy("admin", policy =>
        policy.RequireRole("Admin"));
    options.AddPolicy("operator", policy =>
        policy.RequireRole("Admin", "Operator"));
});

// ── Rate Limiting ───────────────────────────────────────────────
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;

    options.AddFixedWindowLimiter("fixed", limiter =>
    {
        limiter.PermitLimit = 100;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiter.QueueLimit = 10;
    });
});

// ── CORS ────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });

    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://junkfroot.com", "https://www.junkfroot.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// ── Response Caching ────────────────────────────────────────────
builder.Services.AddResponseCaching();

var app = builder.Build();

app.MapDefaultEndpoints();

app.UseCors(app.Environment.IsDevelopment() ? "AllowAngularDev" : "Production");
app.UseRateLimiter();
app.UseResponseCaching();
app.UseAuthentication();
app.UseAuthorization();
app.MapReverseProxy();

app.Run();
