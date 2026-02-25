namespace Junkfroot.CatalogService.Domain;

public class ComboOffer
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public List<ComboProduct> Products { get; set; } = [];
    public bool IsActive { get; set; } = true;
    public DateOnly? ValidFrom { get; set; }
    public DateOnly? ValidUntil { get; set; }
}

public class ComboProduct
{
    public Guid ComboOfferId { get; set; }
    public ComboOffer ComboOffer { get; set; } = null!;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
