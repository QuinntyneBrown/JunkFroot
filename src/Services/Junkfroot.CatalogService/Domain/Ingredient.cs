namespace Junkfroot.CatalogService.Domain;

public class Ingredient
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsAllergen { get; set; }
    public List<ProductIngredient> ProductIngredients { get; set; } = [];
}

public class ProductIngredient
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public Guid IngredientId { get; set; }
    public Ingredient Ingredient { get; set; } = null!;
    public bool IsPrimary { get; set; }
}
