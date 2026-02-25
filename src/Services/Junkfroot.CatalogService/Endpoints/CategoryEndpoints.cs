using Junkfroot.CatalogService.Data;
using Junkfroot.CatalogService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.CatalogService.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/categories").WithTags("Categories");

        group.MapGet("/", async (CatalogDbContext db) =>
        {
            var categories = await db.Categories
                .OrderBy(c => c.SortOrder)
                .ToListAsync();

            return Results.Ok(categories);
        })
        .WithName("GetCategories")
        .Produces<List<Category>>();

        group.MapGet("/{slug}/products", async (string slug, CatalogDbContext db) =>
        {
            var category = await db.Categories
                .Include(c => c.Products.Where(p => p.IsActive))
                    .ThenInclude(p => p.Ingredients)
                        .ThenInclude(pi => pi.Ingredient)
                .Include(c => c.Products)
                    .ThenInclude(p => p.DietaryTags)
                .FirstOrDefaultAsync(c => c.Slug == slug);

            if (category is null) return Results.NotFound();

            return Results.Ok(category.Products.OrderBy(p => p.Name));
        })
        .WithName("GetProductsByCategory")
        .Produces<List<Product>>()
        .Produces(404);
    }
}
