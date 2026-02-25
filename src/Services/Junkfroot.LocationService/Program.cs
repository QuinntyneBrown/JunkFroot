using Junkfroot.LocationService.Data;
using Junkfroot.LocationService.Endpoints;
using Junkfroot.LocationService.Hubs;
using Junkfroot.ServiceDefaults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<LocationDbContext>("location-db");
builder.AddRedisDistributedCache("redis");

builder.Services.AddSignalR();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = builder.Configuration["Jwt:Authority"];
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "junkfroot-identity",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "junkfroot-api",
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("operator", policy =>
        policy.RequireRole("Admin", "Operator"));
    options.AddPolicy("admin", policy =>
        policy.RequireRole("Admin"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("SignalR", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Junkfroot Location Service", Version = "v1" });
});

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("SignalR");
app.UseAuthentication();
app.UseAuthorization();

app.MapTruckLocationEndpoints();
app.MapScheduleEndpoints();
app.MapEventEndpoints();
app.MapHub<TruckLocationHub>("/hubs/truck-location");

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<LocationDbContext>();
    await db.Database.MigrateAsync();
}

app.Run();
