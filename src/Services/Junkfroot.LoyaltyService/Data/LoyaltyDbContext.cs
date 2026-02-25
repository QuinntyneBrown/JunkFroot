using Junkfroot.LoyaltyService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LoyaltyService.Data;

public class LoyaltyDbContext(DbContextOptions<LoyaltyDbContext> options) : DbContext(options)
{
    public DbSet<LoyaltyCard> LoyaltyCards => Set<LoyaltyCard>();
    public DbSet<Punch> Punches => Set<Punch>();
    public DbSet<Reward> Rewards => Set<Reward>();
    public DbSet<RewardRedemption> RewardRedemptions => Set<RewardRedemption>();
    public DbSet<Referral> Referrals => Set<Referral>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LoyaltyCard>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.ReferralCode).IsUnique();
            entity.Property(e => e.ReferralCode).HasMaxLength(20);
            entity.HasMany(e => e.Punches)
                .WithOne(p => p.LoyaltyCard)
                .HasForeignKey(p => p.LoyaltyCardId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Punch>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.OrderId).IsUnique();
            entity.Property(e => e.OrderNumber).HasMaxLength(20).IsRequired();
            entity.Property(e => e.OrderTotal).HasPrecision(10, 2);
        });

        modelBuilder.Entity<Reward>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.DiscountAmount).HasPrecision(10, 2);
            entity.Property(e => e.Type).HasConversion<string>().HasMaxLength(30);
        });

        modelBuilder.Entity<RewardRedemption>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Reward)
                .WithMany(r => r.Redemptions)
                .HasForeignKey(e => e.RewardId);
        });

        modelBuilder.Entity<Referral>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ReferrerUserId, e.RefereeUserId }).IsUnique();
            entity.Property(e => e.ReferralCode).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        });

        SeedRewards(modelBuilder);
    }

    private static void SeedRewards(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reward>().HasData(
            new Reward
            {
                Id = Guid.Parse("e1000001-0000-0000-0000-000000000001"),
                Name = "Free Juice",
                Description = "Any regular-size juice on the house! You earned it, Froot Fam.",
                Type = RewardType.FreeJuice,
                PunchesRequired = 8,
                IsActive = true
            },
            new Reward
            {
                Id = Guid.Parse("e1000002-0000-0000-0000-000000000002"),
                Name = "Birthday Smoothie",
                Description = "Happy birthday! Enjoy a free smoothie during your birthday month.",
                Type = RewardType.BirthdayFreebie,
                PunchesRequired = 0,
                IsActive = true
            },
            new Reward
            {
                Id = Guid.Parse("e1000003-0000-0000-0000-000000000003"),
                Name = "Referral Discount",
                Description = "$3 off your next order for bringing a friend to the Froot Fam!",
                Type = RewardType.ReferralDiscount,
                PunchesRequired = 0,
                DiscountAmount = 3.00m,
                IsActive = true
            }
        );
    }
}
