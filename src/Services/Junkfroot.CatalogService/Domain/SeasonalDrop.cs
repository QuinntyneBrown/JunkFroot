namespace Junkfroot.CatalogService.Domain;

public class SeasonalDrop
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public List<Product> FeaturedProducts { get; set; } = [];
}
