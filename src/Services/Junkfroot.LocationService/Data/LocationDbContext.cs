using Junkfroot.LocationService.Domain;
using Microsoft.EntityFrameworkCore;

namespace Junkfroot.LocationService.Data;

public class LocationDbContext(DbContextOptions<LocationDbContext> options) : DbContext(options)
{
    public DbSet<TruckLocation> TruckLocations => Set<TruckLocation>();
    public DbSet<OperatingSchedule> OperatingSchedules => Set<OperatingSchedule>();
    public DbSet<EventBooking> EventBookings => Set<EventBooking>();
    public DbSet<CateringRequest> CateringRequests => Set<CateringRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TruckLocation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.LocationName).HasMaxLength(200);
        });

        modelBuilder.Entity<OperatingSchedule>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.LocationName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.ClosedReason).HasMaxLength(500);
            entity.Property(e => e.DayOfWeek).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<EventBooking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EventName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Location).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.ContactName).HasMaxLength(200);
            entity.Property(e => e.ContactEmail).HasMaxLength(200);
            entity.Property(e => e.ContactPhone).HasMaxLength(50);
            entity.Property(e => e.Type).HasConversion<string>().HasMaxLength(30);
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<CateringRequest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ContactName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.ContactEmail).HasMaxLength(200).IsRequired();
            entity.Property(e => e.ContactPhone).HasMaxLength(50);
            entity.Property(e => e.EventType).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed default operating schedule
        modelBuilder.Entity<OperatingSchedule>().HasData(
            new OperatingSchedule
            {
                Id = Guid.Parse("f1000001-0000-0000-0000-000000000001"),
                DayOfWeek = DayOfWeek.Monday,
                OpenTime = new TimeOnly(11, 0),
                CloseTime = new TimeOnly(19, 0),
                LocationName = "Nathan Phillips Square",
                Address = "100 Queen St W, Toronto, ON",
                Latitude = 43.6525,
                Longitude = -79.3832
            },
            new OperatingSchedule
            {
                Id = Guid.Parse("f1000002-0000-0000-0000-000000000002"),
                DayOfWeek = DayOfWeek.Tuesday,
                OpenTime = new TimeOnly(11, 0),
                CloseTime = new TimeOnly(19, 0),
                LocationName = "Dundas Square",
                Address = "1 Dundas St E, Toronto, ON",
                Latitude = 43.6561,
                Longitude = -79.3802
            },
            new OperatingSchedule
            {
                Id = Guid.Parse("f1000003-0000-0000-0000-000000000003"),
                DayOfWeek = DayOfWeek.Wednesday,
                OpenTime = new TimeOnly(11, 0),
                CloseTime = new TimeOnly(19, 0),
                LocationName = "Trinity Bellwoods Park",
                Address = "790 Queen St W, Toronto, ON",
                Latitude = 43.6432,
                Longitude = -79.4138
            },
            new OperatingSchedule
            {
                Id = Guid.Parse("f1000004-0000-0000-0000-000000000004"),
                DayOfWeek = DayOfWeek.Thursday,
                OpenTime = new TimeOnly(11, 0),
                CloseTime = new TimeOnly(19, 0),
                LocationName = "Kensington Market",
                Address = "Kensington Ave, Toronto, ON",
                Latitude = 43.6547,
                Longitude = -79.4006
            },
            new OperatingSchedule
            {
                Id = Guid.Parse("f1000005-0000-0000-0000-000000000005"),
                DayOfWeek = DayOfWeek.Friday,
                OpenTime = new TimeOnly(11, 0),
                CloseTime = new TimeOnly(21, 0),
                LocationName = "Harbourfront Centre",
                Address = "235 Queens Quay W, Toronto, ON",
                Latitude = 43.6387,
                Longitude = -79.3823
            },
            new OperatingSchedule
            {
                Id = Guid.Parse("f1000006-0000-0000-0000-000000000006"),
                DayOfWeek = DayOfWeek.Saturday,
                OpenTime = new TimeOnly(10, 0),
                CloseTime = new TimeOnly(21, 0),
                LocationName = "St. Lawrence Market",
                Address = "93 Front St E, Toronto, ON",
                Latitude = 43.6487,
                Longitude = -79.3715
            },
            new OperatingSchedule
            {
                Id = Guid.Parse("f1000007-0000-0000-0000-000000000007"),
                DayOfWeek = DayOfWeek.Sunday,
                OpenTime = new TimeOnly(11, 0),
                CloseTime = new TimeOnly(18, 0),
                LocationName = "High Park",
                Address = "1873 Bloor St W, Toronto, ON",
                Latitude = 43.6465,
                Longitude = -79.4637
            }
        );

        // Seed initial truck location
        modelBuilder.Entity<TruckLocation>().HasData(
            new TruckLocation
            {
                Id = Guid.Parse("f2000001-0000-0000-0000-000000000001"),
                Latitude = 43.6525,
                Longitude = -79.3832,
                Address = "100 Queen St W, Toronto, ON",
                LocationName = "Nathan Phillips Square",
                IsActive = true
            }
        );
    }
}
