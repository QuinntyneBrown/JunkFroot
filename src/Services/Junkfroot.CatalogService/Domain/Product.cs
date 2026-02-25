namespace Junkfroot.CatalogService.Domain;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Inspiration { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public List<ProductIngredient> Ingredients { get; set; } = [];
    public List<DietaryTag> DietaryTags { get; set; } = [];
    public string? ImageUrl { get; set; }
    public bool IsSeasonal { get; set; }
    public bool IsActive { get; set; } = true;
    public DateOnly? AvailableFrom { get; set; }
    public DateOnly? AvailableUntil { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
