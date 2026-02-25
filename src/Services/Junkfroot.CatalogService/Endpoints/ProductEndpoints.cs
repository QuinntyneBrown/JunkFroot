using Junkfroot.CatalogService.Data;
using Junkfroot.CatalogService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.CatalogService.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products").WithTags("Products");

        group.MapGet("/", async (CatalogDbContext db) =>
        {
            var products = await db.Products
                .Include(p => p.Category)
                .Include(p => p.Ingredients).ThenInclude(pi => pi.Ingredient)
                .Include(p => p.DietaryTags)
                .Where(p => p.IsActive)
                .OrderBy(p => p.Name)
                .ToListAsync();

            return Results.Ok(products);
        })
        .WithName("GetProducts")
        .Produces<List<Product>>();

        group.MapGet("/{id:guid}", async (Guid id, CatalogDbContext db) =>
        {
            var product = await db.Products
                .Include(p => p.Category)
                .Include(p => p.Ingredients).ThenInclude(pi => pi.Ingredient)
                .Include(p => p.DietaryTags)
                .FirstOrDefaultAsync(p => p.Id == id);

            return product is null ? Results.NotFound() : Results.Ok(product);
        })
        .WithName("GetProductById")
        .Produces<Product>()
        .Produces(404);

        group.MapGet("/featured", async (CatalogDbContext db) =>
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var products = await db.Products
                .Include(p => p.Category)
                .Include(p => p.DietaryTags)
                .Where(p => p.IsActive && (p.IsSeasonal || p.AvailableFrom <= today))
                .OrderByDescending(p => p.CreatedAt)
                .Take(6)
                .ToListAsync();

            return Results.Ok(products);
        })
        .WithName("GetFeaturedProducts")
        .Produces<List<Product>>();

        group.MapPost("/", async (CreateProductRequest request, CatalogDbContext db) =>
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Slug = request.Slug,
                Description = request.Description,
                Inspiration = request.Inspiration,
                Price = request.Price,
                CategoryId = request.CategoryId,
                ImageUrl = request.ImageUrl,
                IsSeasonal = request.IsSeasonal,
                IsActive = true,
                AvailableFrom = request.AvailableFrom,
                AvailableUntil = request.AvailableUntil
            };

            db.Products.Add(product);
            await db.SaveChangesAsync();

            return Results.Created($"/products/{product.Id}", product);
        })
        .WithName("CreateProduct")
        .RequireAuthorization("admin")
        .Produces<Product>(201);

        group.MapPut("/{id:guid}", async (Guid id, UpdateProductRequest request, CatalogDbContext db) =>
        {
            var product = await db.Products.FindAsync(id);
            if (product is null) return Results.NotFound();

            product.Name = request.Name ?? product.Name;
            product.Description = request.Description ?? product.Description;
            product.Inspiration = request.Inspiration ?? product.Inspiration;
            product.Price = request.Price ?? product.Price;
            product.ImageUrl = request.ImageUrl ?? product.ImageUrl;
            product.IsSeasonal = request.IsSeasonal ?? product.IsSeasonal;
            product.IsActive = request.IsActive ?? product.IsActive;
            product.AvailableFrom = request.AvailableFrom ?? product.AvailableFrom;
            product.AvailableUntil = request.AvailableUntil ?? product.AvailableUntil;
            product.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return Results.Ok(product);
        })
        .WithName("UpdateProduct")
        .RequireAuthorization("admin")
        .Produces<Product>()
        .Produces(404);
    }
}

public record CreateProductRequest(
    string Name,
    string Slug,
    string Description,
    string Inspiration,
    decimal Price,
    Guid CategoryId,
    string? ImageUrl,
    bool IsSeasonal,
    DateOnly? AvailableFrom,
    DateOnly? AvailableUntil);

public record UpdateProductRequest(
    string? Name,
    string? Description,
    string? Inspiration,
    decimal? Price,
    string? ImageUrl,
    bool? IsSeasonal,
    bool? IsActive,
    DateOnly? AvailableFrom,
    DateOnly? AvailableUntil);
