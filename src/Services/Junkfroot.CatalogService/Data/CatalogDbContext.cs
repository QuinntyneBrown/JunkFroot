using Junkfroot.CatalogService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.CatalogService.Data;

public class CatalogDbContext(DbContextOptions<CatalogDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<ProductIngredient> ProductIngredients => Set<ProductIngredient>();
    public DbSet<DietaryTag> DietaryTags => Set<DietaryTag>();
    public DbSet<ComboOffer> ComboOffers => Set<ComboOffer>();
    public DbSet<ComboProduct> ComboProducts => Set<ComboProduct>();
    public DbSet<SeasonalDrop> SeasonalDrops => Set<SeasonalDrop>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(e => e.CategoryId);
            entity.HasMany(e => e.DietaryTags)
                .WithMany(t => t.Products)
                .UsingEntity("ProductDietaryTags");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<Ingredient>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<ProductIngredient>(entity =>
        {
            entity.HasKey(e => new { e.ProductId, e.IngredientId });
            entity.HasOne(e => e.Product)
                .WithMany(p => p.Ingredients)
                .HasForeignKey(e => e.ProductId);
            entity.HasOne(e => e.Ingredient)
                .WithMany(i => i.ProductIngredients)
                .HasForeignKey(e => e.IngredientId);
        });

        modelBuilder.Entity<DietaryTag>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Abbreviation).HasMaxLength(10).IsRequired();
        });

        modelBuilder.Entity<ComboOffer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.DiscountAmount).HasPrecision(10, 2);
            entity.Property(e => e.DiscountPercentage).HasPrecision(5, 2);
        });

        modelBuilder.Entity<ComboProduct>(entity =>
        {
            entity.HasKey(e => new { e.ComboOfferId, e.ProductId });
            entity.HasOne(e => e.ComboOffer)
                .WithMany(c => c.Products)
                .HasForeignKey(e => e.ComboOfferId);
            entity.HasOne(e => e.Product)
                .WithMany()
                .HasForeignKey(e => e.ProductId);
        });

        modelBuilder.Entity<SeasonalDrop>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.HasMany(e => e.FeaturedProducts)
                .WithMany()
                .UsingEntity("SeasonalDropProducts");
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var juicesId = Guid.Parse("a1000001-0000-0000-0000-000000000001");
        var smoothiesId = Guid.Parse("a1000002-0000-0000-0000-000000000002");
        var shotsId = Guid.Parse("a1000003-0000-0000-0000-000000000003");
        var seasonalId = Guid.Parse("a1000004-0000-0000-0000-000000000004");

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = juicesId, Name = "Juices", Slug = "juices", Description = "Fresh-pressed Caribbean-inspired juices", SortOrder = 1 },
            new Category { Id = smoothiesId, Name = "Smoothies", Slug = "smoothies", Description = "Thick and creamy tropical smoothies", SortOrder = 2 },
            new Category { Id = shotsId, Name = "Shots", Slug = "shots", Description = "Concentrated wellness shots", SortOrder = 3 },
            new Category { Id = seasonalId, Name = "Seasonal", Slug = "seasonal", Description = "Limited-time seasonal creations", SortOrder = 4 }
        );

        var veganId = Guid.Parse("b1000001-0000-0000-0000-000000000001");
        var gfId = Guid.Parse("b1000002-0000-0000-0000-000000000002");
        var dfId = Guid.Parse("b1000003-0000-0000-0000-000000000003");
        var nfId = Guid.Parse("b1000004-0000-0000-0000-000000000004");

        modelBuilder.Entity<DietaryTag>().HasData(
            new DietaryTag { Id = veganId, Name = "Vegan", Abbreviation = "V" },
            new DietaryTag { Id = gfId, Name = "Gluten-Free", Abbreviation = "GF" },
            new DietaryTag { Id = dfId, Name = "Dairy-Free", Abbreviation = "DF" },
            new DietaryTag { Id = nfId, Name = "Nut-Free", Abbreviation = "NF" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = Guid.Parse("c1000001-0000-0000-0000-000000000001"),
                Name = "Trini Sunrise",
                Slug = "trini-sunrise",
                Description = "A vibrant blend of mango, pineapple, and passion fruit that captures the warmth of a Caribbean morning.",
                Inspiration = "Inspired by the golden sunrises over Maracas Bay in Trinidad, where the sky turns shades of mango and passion fruit.",
                Price = 9.99m,
                CategoryId = juicesId,
                IsActive = true,
                IsSeasonal = false
            },
            new Product
            {
                Id = Guid.Parse("c1000002-0000-0000-0000-000000000002"),
                Name = "Island Breeze",
                Slug = "island-breeze",
                Description = "Refreshing watermelon, cucumber, and lime juice with a hint of mint.",
                Inspiration = "Cool as the trade winds that blow through the islands, this drink is pure refreshment.",
                Price = 8.99m,
                CategoryId = juicesId,
                IsActive = true,
                IsSeasonal = false
            },
            new Product
            {
                Id = Guid.Parse("c1000003-0000-0000-0000-000000000003"),
                Name = "Bajan Gold",
                Slug = "bajan-gold",
                Description = "Turmeric, ginger, orange, and coconut water - an anti-inflammatory powerhouse.",
                Inspiration = "Named after the golden beaches of Barbados, this juice brings island wellness to every sip.",
                Price = 10.99m,
                CategoryId = juicesId,
                IsActive = true,
                IsSeasonal = false
            },
            new Product
            {
                Id = Guid.Parse("c1000004-0000-0000-0000-000000000004"),
                Name = "Coco Loco Smoothie",
                Slug = "coco-loco-smoothie",
                Description = "Creamy coconut milk, banana, pineapple, and a touch of nutmeg.",
                Inspiration = "The classic Caribbean combination - like sipping a smoothie on the shores of Tobago.",
                Price = 11.99m,
                CategoryId = smoothiesId,
                IsActive = true,
                IsSeasonal = false
            },
            new Product
            {
                Id = Guid.Parse("c1000005-0000-0000-0000-000000000005"),
                Name = "Rum Punch Smoothie",
                Slug = "rum-punch-smoothie",
                Description = "Guava, passion fruit, and grenadine blended thick - all the punch flavour, no alcohol.",
                Inspiration = "Every Caribbean party starts with rum punch. We kept the vibe and lost the hangover.",
                Price = 11.99m,
                CategoryId = smoothiesId,
                IsActive = true,
                IsSeasonal = false
            },
            new Product
            {
                Id = Guid.Parse("c1000006-0000-0000-0000-000000000006"),
                Name = "Ginger Fire Shot",
                Slug = "ginger-fire-shot",
                Description = "Concentrated ginger, cayenne, lemon, and honey. Wake up your whole system.",
                Inspiration = "Caribbean grandmothers have been using ginger as medicine for generations. We just made it portable.",
                Price = 4.99m,
                CategoryId = shotsId,
                IsActive = true,
                IsSeasonal = false
            },
            new Product
            {
                Id = Guid.Parse("c1000007-0000-0000-0000-000000000007"),
                Name = "Sea Moss Vitality",
                Slug = "sea-moss-vitality",
                Description = "Irish sea moss, bladderwrack, lime, and agave. 92 of 102 minerals your body needs.",
                Inspiration = "A Jamaican staple that's been fueling island strength for centuries.",
                Price = 5.99m,
                CategoryId = shotsId,
                IsActive = true,
                IsSeasonal = false
            }
        );
    }
}
