namespace Junkfroot.CatalogService.Domain;

public class DietaryTag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Abbreviation { get; set; } = string.Empty;
    public List<Product> Products { get; set; } = [];
}
