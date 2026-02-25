using Junkfroot.CatalogService.Data;
using Junkfroot.CatalogService.Domain;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Junkfroot.CatalogService.Tests;

public class CatalogDbContextTests
{
    private static CatalogDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<CatalogDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new CatalogDbContext(options);
    }

    [Fact]
    public async Task Can_Add_And_Retrieve_Product()
    {
        using var context = CreateContext();

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Juices",
            Slug = "juices",
            SortOrder = 1
        };

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Test Juice",
            Slug = "test-juice",
            Description = "A test juice",
            Inspiration = "Test inspiration",
            Price = 9.99m,
            CategoryId = category.Id,
            Category = category,
            IsActive = true
        };

        context.Categories.Add(category);
        context.Products.Add(product);
        await context.SaveChangesAsync();

        var retrieved = await context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == product.Id);

        Assert.NotNull(retrieved);
        Assert.Equal("Test Juice", retrieved.Name);
        Assert.Equal("Juices", retrieved.Category.Name);
    }

    [Fact]
    public async Task Can_Query_Active_Products()
    {
        using var context = CreateContext();

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Smoothies",
            Slug = "smoothies",
            SortOrder = 2
        };

        context.Categories.Add(category);
        context.Products.AddRange(
            new Product { Id = Guid.NewGuid(), Name = "Active", Slug = "active", Price = 10, CategoryId = category.Id, IsActive = true },
            new Product { Id = Guid.NewGuid(), Name = "Inactive", Slug = "inactive", Price = 10, CategoryId = category.Id, IsActive = false }
        );
        await context.SaveChangesAsync();

        var activeProducts = await context.Products.Where(p => p.IsActive).ToListAsync();

        Assert.Single(activeProducts);
        Assert.Equal("Active", activeProducts[0].Name);
    }
}
