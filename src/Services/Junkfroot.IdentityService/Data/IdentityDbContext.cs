using Junkfroot.IdentityService.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.IdentityService.Data;

public class IdentityDbContext(DbContextOptions<IdentityDbContext> options)
    : IdentityDbContext<AppUser, AppRole, Guid>(options)
{
    public DbSet<CustomerProfile> CustomerProfiles => Set<CustomerProfile>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.LastName).HasMaxLength(100).IsRequired();
            entity.HasOne(e => e.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<CustomerProfile>(p => p.UserId);
        });

        modelBuilder.Entity<AppRole>(entity =>
        {
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<CustomerProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AvatarUrl).HasMaxLength(500);
            entity.Property(e => e.FavouriteProduct).HasMaxLength(200);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token).IsUnique();
            entity.Property(e => e.Token).HasMaxLength(500).IsRequired();
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        SeedRoles(modelBuilder);
    }

    private static void SeedRoles(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppRole>().HasData(
            new AppRole
            {
                Id = Guid.Parse("d1000001-0000-0000-0000-000000000001"),
                Name = Roles.Customer,
                NormalizedName = Roles.Customer.ToUpperInvariant(),
                Description = "Regular customer - browse, order, manage profile, view loyalty"
            },
            new AppRole
            {
                Id = Guid.Parse("d1000002-0000-0000-0000-000000000002"),
                Name = Roles.Operator,
                NormalizedName = Roles.Operator.ToUpperInvariant(),
                Description = "Truck operator - manage orders, update location, view analytics"
            },
            new AppRole
            {
                Id = Guid.Parse("d1000003-0000-0000-0000-000000000003"),
                Name = Roles.Admin,
                NormalizedName = Roles.Admin.ToUpperInvariant(),
                Description = "Full admin access - menu management, user management, reporting"
            }
        );
    }
}
