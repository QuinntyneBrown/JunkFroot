using Junkfroot.CatalogService.Data;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.CatalogService.Endpoints;

public static class IngredientEndpoints
{
    public static void MapIngredientEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/ingredients").WithTags("Ingredients");

        group.MapGet("/", async (CatalogDbContext db) =>
        {
            var ingredients = await db.Ingredients
                .OrderBy(i => i.Name)
                .ToListAsync();

            return Results.Ok(ingredients);
        })
        .WithName("GetIngredients")
        .Produces<List<Ingredient>>();

        group.MapGet("/allergens", async (CatalogDbContext db) =>
        {
            var allergens = await db.Ingredients
                .Where(i => i.IsAllergen)
                .OrderBy(i => i.Name)
                .ToListAsync();

            return Results.Ok(allergens);
        })
        .WithName("GetAllergens")
        .Produces<List<Ingredient>>();

    }
}
