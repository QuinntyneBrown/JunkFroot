# Junkfroot - Implementation Design

### .NET Aspire Microservices + Angular Frontend

### Prepared: February 2026

---

## Table of Contents

1. [Solution Overview](#1-solution-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Solution Structure](#3-solution-structure)
4. [Aspire AppHost](#4-aspire-apphost)
5. [Aspire ServiceDefaults](#5-aspire-servicedefaults)
6. [API Gateway](#6-api-gateway)
7. [Microservices](#7-microservices)
8. [Angular Workspace](#8-angular-workspace)
9. [Data Architecture](#9-data-architecture)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Observability & Monitoring](#11-observability--monitoring)
12. [Deployment Strategy](#12-deployment-strategy)
13. [Implementation Phases](#13-implementation-phases)

---

## 1. Solution Overview

Junkfroot is a Caribbean-inspired mobile fresh juice brand operating across the Greater Toronto Area. This implementation design defines the full-stack platform powering:

- **Online Ordering** - Pre-orders, subscriptions, and juice cleanses
- **Menu Management** - Products, seasonal drops, pricing, combos
- **Loyalty Program** - "Froot Fam" digital punch card, rewards, referrals
- **Truck Location Tracking** - Real-time GPS for customers to find the truck
- **Event & Catering Management** - Bookings, invoicing, scheduling
- **Customer Engagement** - Profiles, order history, preferences
- **Operations Dashboard** - Inventory, daily sales, scheduling, analytics
- **Content & Brand** - Caribbean culture stories, blog, social media feed integration

### Technology Stack

| Layer | Technology |
|---|---|
| **Orchestration** | .NET Aspire 9.x |
| **Backend Runtime** | .NET 9 / ASP.NET Core |
| **API Gateway** | YARP (Yet Another Reverse Proxy) |
| **Services** | ASP.NET Core Minimal APIs |
| **Database** | PostgreSQL (per-service databases) |
| **Cache** | Redis (via Aspire integration) |
| **Message Broker** | RabbitMQ (via Aspire integration) |
| **Frontend** | Angular 19 (Standalone Components, Signals) |
| **Auth** | Keycloak (via Aspire integration) or ASP.NET Identity + JWT |
| **Storage** | Azure Blob Storage / MinIO (images, assets) |
| **Search** | Elasticsearch (menu, content search) |
| **Real-time** | SignalR (truck location, order status) |

---

## 2. Architecture Diagram

```
                         +---------------------+
                         |   Angular SPA (Web)  |
                         |   junk-froot app     |
                         +----------+----------+
                                    |
                                    | HTTPS
                                    v
                         +----------+----------+
                         |    API Gateway       |
                         |    (YARP Proxy)      |
                         +----+----+----+------+
                              |    |    |
              +---------------+    |    +---------------+
              |                    |                    |
              v                    v                    v
     +--------+------+   +--------+------+   +---------+-----+
     | Catalog        |   | Orders         |   | Identity       |
     | Service        |   | Service        |   | Service        |
     | (Menu/Products)|   | (Cart/Checkout)|   | (Auth/Users)   |
     +--------+------+   +--------+------+   +---------+-----+
              |                    |                    |
              v                    v                    v
     +--------+------+   +--------+------+   +---------+-----+
     | PostgreSQL     |   | PostgreSQL     |   | PostgreSQL     |
     | (catalog_db)   |   | (orders_db)    |   | (identity_db)  |
     +---------------+   +---------------+   +---------------+

              +---------------+    +---------------+
              |                    |
              v                    v
     +--------+------+   +--------+------+
     | Loyalty        |   | Location       |
     | Service        |   | Service        |
     | (Froot Fam)    |   | (Truck GPS)    |
     +--------+------+   +--------+------+
              |                    |
              v                    v
     +--------+------+   +--------+------+
     | PostgreSQL     |   | PostgreSQL     |
     | (loyalty_db)   |   | (location_db)  |
     +---------------+   +---------------+

     Shared Infrastructure (via Aspire):
     +----------+  +-----------+  +-------------+
     |  Redis   |  | RabbitMQ  |  | Blob Storage|
     +----------+  +-----------+  +-------------+
```

---

## 3. Solution Structure

```
Junkfroot/
├── Junkfroot.sln
│
├── src/
│   ├── Junkfroot.AppHost/                    # Aspire AppHost (orchestrator)
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── Junkfroot.AppHost.csproj
│   │
│   ├── Junkfroot.ServiceDefaults/            # Shared service configuration
│   │   ├── Extensions.cs
│   │   └── Junkfroot.ServiceDefaults.csproj
│   │
│   ├── Junkfroot.ApiGateway/                 # YARP-based API Gateway
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   ├── yarp.json
│   │   └── Junkfroot.ApiGateway.csproj
│   │
│   ├── Services/
│   │   ├── Junkfroot.CatalogService/         # Menu, products, ingredients
│   │   │   ├── Program.cs
│   │   │   ├── Endpoints/
│   │   │   │   ├── ProductEndpoints.cs
│   │   │   │   ├── CategoryEndpoints.cs
│   │   │   │   └── IngredientEndpoints.cs
│   │   │   ├── Domain/
│   │   │   │   ├── Product.cs
│   │   │   │   ├── Category.cs
│   │   │   │   ├── Ingredient.cs
│   │   │   │   ├── ComboOffer.cs
│   │   │   │   └── SeasonalDrop.cs
│   │   │   ├── Data/
│   │   │   │   ├── CatalogDbContext.cs
│   │   │   │   └── Migrations/
│   │   │   ├── Services/
│   │   │   └── Junkfroot.CatalogService.csproj
│   │   │
│   │   ├── Junkfroot.OrderService/           # Cart, checkout, order tracking
│   │   │   ├── Program.cs
│   │   │   ├── Endpoints/
│   │   │   │   ├── CartEndpoints.cs
│   │   │   │   ├── OrderEndpoints.cs
│   │   │   │   └── PaymentEndpoints.cs
│   │   │   ├── Domain/
│   │   │   │   ├── Order.cs
│   │   │   │   ├── OrderItem.cs
│   │   │   │   ├── Cart.cs
│   │   │   │   └── Payment.cs
│   │   │   ├── Data/
│   │   │   │   ├── OrderDbContext.cs
│   │   │   │   └── Migrations/
│   │   │   ├── Services/
│   │   │   │   ├── PaymentService.cs        # Square POS integration
│   │   │   │   └── OrderEventPublisher.cs
│   │   │   └── Junkfroot.OrderService.csproj
│   │   │
│   │   ├── Junkfroot.IdentityService/        # Auth, user profiles, roles
│   │   │   ├── Program.cs
│   │   │   ├── Endpoints/
│   │   │   │   ├── AuthEndpoints.cs
│   │   │   │   └── ProfileEndpoints.cs
│   │   │   ├── Domain/
│   │   │   │   ├── AppUser.cs
│   │   │   │   ├── CustomerProfile.cs
│   │   │   │   └── Role.cs
│   │   │   ├── Data/
│   │   │   │   ├── IdentityDbContext.cs
│   │   │   │   └── Migrations/
│   │   │   └── Junkfroot.IdentityService.csproj
│   │   │
│   │   ├── Junkfroot.LoyaltyService/         # Froot Fam program
│   │   │   ├── Program.cs
│   │   │   ├── Endpoints/
│   │   │   │   ├── LoyaltyEndpoints.cs
│   │   │   │   ├── RewardEndpoints.cs
│   │   │   │   └── ReferralEndpoints.cs
│   │   │   ├── Domain/
│   │   │   │   ├── LoyaltyCard.cs
│   │   │   │   ├── Punch.cs
│   │   │   │   ├── Reward.cs
│   │   │   │   └── Referral.cs
│   │   │   ├── Data/
│   │   │   │   ├── LoyaltyDbContext.cs
│   │   │   │   └── Migrations/
│   │   │   ├── Consumers/
│   │   │   │   └── OrderCompletedConsumer.cs  # RabbitMQ: auto-punch on order
│   │   │   └── Junkfroot.LoyaltyService.csproj
│   │   │
│   │   └── Junkfroot.LocationService/        # Truck GPS, scheduling, events
│   │       ├── Program.cs
│   │       ├── Endpoints/
│   │       │   ├── TruckLocationEndpoints.cs
│   │       │   ├── ScheduleEndpoints.cs
│   │       │   └── EventEndpoints.cs
│   │       ├── Domain/
│   │       │   ├── TruckLocation.cs
│   │       │   ├── OperatingSchedule.cs
│   │       │   └── EventBooking.cs
│   │       ├── Data/
│   │       │   ├── LocationDbContext.cs
│   │       │   └── Migrations/
│   │       ├── Hubs/
│   │       │   └── TruckLocationHub.cs        # SignalR real-time location
│   │       └── Junkfroot.LocationService.csproj
│   │
│   └── web/                                   # Angular Workspace
│       ├── angular.json
│       ├── package.json
│       ├── tsconfig.json
│       ├── nx.json (optional - for Nx monorepo tooling)
│       │
│       ├── projects/
│       │   ├── api/                           # API Library Project
│       │   │   ├── src/
│       │   │   │   ├── public-api.ts
│       │   │   │   ├── lib/
│       │   │   │   │   ├── models/
│       │   │   │   │   │   ├── product.model.ts
│       │   │   │   │   │   ├── order.model.ts
│       │   │   │   │   │   ├── cart.model.ts
│       │   │   │   │   │   ├── user.model.ts
│       │   │   │   │   │   ├── loyalty.model.ts
│       │   │   │   │   │   ├── location.model.ts
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── services/
│       │   │   │   │   │   ├── catalog-api.service.ts
│       │   │   │   │   │   ├── order-api.service.ts
│       │   │   │   │   │   ├── auth-api.service.ts
│       │   │   │   │   │   ├── loyalty-api.service.ts
│       │   │   │   │   │   ├── location-api.service.ts
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── interceptors/
│       │   │   │   │   │   ├── auth.interceptor.ts
│       │   │   │   │   │   └── error.interceptor.ts
│       │   │   │   │   └── config/
│       │   │   │   │       └── api.config.ts
│       │   │   │   └── index.ts
│       │   │   ├── ng-package.json
│       │   │   └── tsconfig.lib.json
│       │   │
│       │   ├── components/                    # Components Library Project
│       │   │   ├── src/
│       │   │   │   ├── public-api.ts
│       │   │   │   ├── lib/
│       │   │   │   │   ├── layout/
│       │   │   │   │   │   ├── header/
│       │   │   │   │   │   │   └── header.component.ts
│       │   │   │   │   │   ├── footer/
│       │   │   │   │   │   │   └── footer.component.ts
│       │   │   │   │   │   ├── nav/
│       │   │   │   │   │   │   └── nav.component.ts
│       │   │   │   │   │   └── shell/
│       │   │   │   │   │       └── shell.component.ts
│       │   │   │   │   ├── product/
│       │   │   │   │   │   ├── product-card/
│       │   │   │   │   │   │   └── product-card.component.ts
│       │   │   │   │   │   ├── product-list/
│       │   │   │   │   │   │   └── product-list.component.ts
│       │   │   │   │   │   └── product-detail/
│       │   │   │   │   │       └── product-detail.component.ts
│       │   │   │   │   ├── cart/
│       │   │   │   │   │   ├── cart-drawer/
│       │   │   │   │   │   │   └── cart-drawer.component.ts
│       │   │   │   │   │   ├── cart-item/
│       │   │   │   │   │   │   └── cart-item.component.ts
│       │   │   │   │   │   └── cart-summary/
│       │   │   │   │   │       └── cart-summary.component.ts
│       │   │   │   │   ├── loyalty/
│       │   │   │   │   │   ├── punch-card/
│       │   │   │   │   │   │   └── punch-card.component.ts
│       │   │   │   │   │   └── rewards-list/
│       │   │   │   │   │       └── rewards-list.component.ts
│       │   │   │   │   ├── location/
│       │   │   │   │   │   ├── truck-map/
│       │   │   │   │   │   │   └── truck-map.component.ts
│       │   │   │   │   │   └── schedule-card/
│       │   │   │   │   │       └── schedule-card.component.ts
│       │   │   │   │   └── shared/
│       │   │   │   │       ├── button/
│       │   │   │   │       │   └── button.component.ts
│       │   │   │   │       ├── badge/
│       │   │   │   │       │   └── badge.component.ts
│       │   │   │   │       ├── loading-spinner/
│       │   │   │   │       │   └── loading-spinner.component.ts
│       │   │   │   │       └── toast/
│       │   │   │   │           └── toast.component.ts
│       │   │   │   └── index.ts
│       │   │   ├── ng-package.json
│       │   │   └── tsconfig.lib.json
│       │   │
│       │   └── junk-froot/                    # Main Application Project
│       │       ├── src/
│       │       │   ├── main.ts
│       │       │   ├── app/
│       │       │   │   ├── app.component.ts
│       │       │   │   ├── app.config.ts
│       │       │   │   ├── app.routes.ts
│       │       │   │   ├── pages/
│       │       │   │   │   ├── home/
│       │       │   │   │   │   └── home.component.ts
│       │       │   │   │   ├── menu/
│       │       │   │   │   │   └── menu.component.ts
│       │       │   │   │   ├── product/
│       │       │   │   │   │   └── product.component.ts
│       │       │   │   │   ├── cart/
│       │       │   │   │   │   └── cart.component.ts
│       │       │   │   │   ├── checkout/
│       │       │   │   │   │   └── checkout.component.ts
│       │       │   │   │   ├── find-us/
│       │       │   │   │   │   └── find-us.component.ts
│       │       │   │   │   ├── loyalty/
│       │       │   │   │   │   └── loyalty.component.ts
│       │       │   │   │   ├── account/
│       │       │   │   │   │   ├── profile.component.ts
│       │       │   │   │   │   ├── orders.component.ts
│       │       │   │   │   │   └── login.component.ts
│       │       │   │   │   ├── catering/
│       │       │   │   │   │   └── catering.component.ts
│       │       │   │   │   └── about/
│       │       │   │   │       └── about.component.ts
│       │       │   │   └── store/
│       │       │   │       ├── cart.store.ts
│       │       │   │       ├── auth.store.ts
│       │       │   │       └── menu.store.ts
│       │       │   ├── styles.scss
│       │       │   ├── assets/
│       │       │   │   ├── images/
│       │       │   │   ├── fonts/
│       │       │   │   └── icons/
│       │       │   └── environments/
│       │       │       ├── environment.ts
│       │       │       └── environment.prod.ts
│       │       ├── proxy.conf.js
│       │       └── tsconfig.app.json
│       │
│       └── tailwind.config.js
│
├── tests/
│   ├── Junkfroot.CatalogService.Tests/
│   ├── Junkfroot.OrderService.Tests/
│   ├── Junkfroot.IdentityService.Tests/
│   ├── Junkfroot.LoyaltyService.Tests/
│   ├── Junkfroot.LocationService.Tests/
│   └── Junkfroot.Integration.Tests/
│
├── docs/
│   ├── Junkfroot_Business_Plan.md
│   └── Implementation_Design.md
│
├── designs/
│   └── design.pen
│
└── images/
    └── (brand assets)
```

---

## 4. Aspire AppHost

The AppHost is the orchestration center. It wires all services, infrastructure dependencies, and the Angular frontend into a single runnable application graph.

### `Junkfroot.AppHost/Program.cs`

```csharp
var builder = DistributedApplication.CreateBuilder(args);

// ── Infrastructure ──────────────────────────────────────────────
var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin();

var catalogDb   = postgres.AddDatabase("catalog-db");
var ordersDb    = postgres.AddDatabase("orders-db");
var identityDb  = postgres.AddDatabase("identity-db");
var loyaltyDb   = postgres.AddDatabase("loyalty-db");
var locationDb  = postgres.AddDatabase("location-db");

var redis = builder.AddRedis("redis")
    .WithRedisInsight();

var rabbitmq = builder.AddRabbitMQ("messaging")
    .WithManagementPlugin();

var blobStorage = builder.AddAzureBlobStorage("blobs");

// ── Services ────────────────────────────────────────────────────
var identityService = builder.AddProject<Projects.Junkfroot_IdentityService>("identity-service")
    .WithReference(identityDb)
    .WithReference(redis);

var catalogService = builder.AddProject<Projects.Junkfroot_CatalogService>("catalog-service")
    .WithReference(catalogDb)
    .WithReference(redis)
    .WithReference(blobStorage);

var orderService = builder.AddProject<Projects.Junkfroot_OrderService>("order-service")
    .WithReference(ordersDb)
    .WithReference(redis)
    .WithReference(rabbitmq);

var loyaltyService = builder.AddProject<Projects.Junkfroot_LoyaltyService>("loyalty-service")
    .WithReference(loyaltyDb)
    .WithReference(rabbitmq);

var locationService = builder.AddProject<Projects.Junkfroot_LocationService>("location-service")
    .WithReference(locationDb)
    .WithReference(redis);

// ── API Gateway ─────────────────────────────────────────────────
var apiGateway = builder.AddProject<Projects.Junkfroot_ApiGateway>("api-gateway")
    .WithReference(identityService)
    .WithReference(catalogService)
    .WithReference(orderService)
    .WithReference(loyaltyService)
    .WithReference(locationService);

// ── Angular Frontend ────────────────────────────────────────────
builder.AddNpmApp("junk-froot-web", "../web/projects/junk-froot")
    .WithReference(apiGateway)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
```

### Project File Dependencies

```xml
<!-- Junkfroot.AppHost.csproj -->
<Project Sdk="Microsoft.NET.Sdk">
  <Sdk Name="Aspire.AppHost.Sdk" Version="9.1.0" />

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Aspire.Hosting.PostgreSQL" />
    <PackageReference Include="Aspire.Hosting.Redis" />
    <PackageReference Include="Aspire.Hosting.RabbitMQ" />
    <PackageReference Include="Aspire.Hosting.Azure.Storage" />
    <PackageReference Include="Aspire.Hosting.NodeJs" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Junkfroot.ApiGateway\Junkfroot.ApiGateway.csproj" />
    <ProjectReference Include="..\Services\Junkfroot.CatalogService\Junkfroot.CatalogService.csproj" />
    <ProjectReference Include="..\Services\Junkfroot.OrderService\Junkfroot.OrderService.csproj" />
    <ProjectReference Include="..\Services\Junkfroot.IdentityService\Junkfroot.IdentityService.csproj" />
    <ProjectReference Include="..\Services\Junkfroot.LoyaltyService\Junkfroot.LoyaltyService.csproj" />
    <ProjectReference Include="..\Services\Junkfroot.LocationService\Junkfroot.LocationService.csproj" />
  </ItemGroup>
</Project>
```

---

## 5. Aspire ServiceDefaults

Shared configuration applied to every microservice for consistent observability, resilience, and service discovery.

### `Junkfroot.ServiceDefaults/Extensions.cs`

```csharp
public static class Extensions
{
    public static IHostApplicationBuilder AddServiceDefaults(
        this IHostApplicationBuilder builder)
    {
        builder.ConfigureOpenTelemetry();
        builder.AddDefaultHealthChecks();
        builder.Services.AddServiceDiscovery();

        builder.Services.ConfigureHttpClientDefaults(http =>
        {
            http.AddStandardResilienceHandler();
            http.AddServiceDiscovery();
        });

        return builder;
    }

    public static IHostApplicationBuilder ConfigureOpenTelemetry(
        this IHostApplicationBuilder builder)
    {
        builder.Logging.AddOpenTelemetry(logging =>
        {
            logging.IncludeFormattedMessage = true;
            logging.IncludeScopes = true;
        });

        builder.Services.AddOpenTelemetry()
            .WithMetrics(metrics =>
            {
                metrics.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddRuntimeInstrumentation();
            })
            .WithTracing(tracing =>
            {
                tracing.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddEntityFrameworkCoreInstrumentation();
            });

        builder.AddOpenTelemetryExporters();
        return builder;
    }

    public static IHostApplicationBuilder AddDefaultHealthChecks(
        this IHostApplicationBuilder builder)
    {
        builder.Services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

        return builder;
    }

    public static WebApplication MapDefaultEndpoints(this WebApplication app)
    {
        app.MapHealthChecks("/health");
        app.MapHealthChecks("/alive", new()
        {
            Predicate = r => r.Tags.Contains("live")
        });
        return app;
    }

    private static IHostApplicationBuilder AddOpenTelemetryExporters(
        this IHostApplicationBuilder builder)
    {
        builder.Services.AddOpenTelemetry()
            .UseOtlpExporter();
        return builder;
    }
}
```

### What ServiceDefaults Provides

| Concern | Implementation |
|---|---|
| **Health Checks** | `/health` (readiness) and `/alive` (liveness) endpoints |
| **OpenTelemetry** | Distributed tracing, metrics, structured logging via OTLP |
| **Service Discovery** | Aspire-native service resolution by name |
| **HTTP Resilience** | Retry, circuit breaker, timeout policies on all HttpClient instances |
| **Consistent Configuration** | Shared `appsettings` patterns, environment variable binding |

---

## 6. API Gateway

The API Gateway uses YARP (Yet Another Reverse Proxy) to provide a single entry point for the Angular frontend, handling routing, rate limiting, authentication verification, and CORS.

### Route Configuration (`yarp.json`)

```json
{
  "ReverseProxy": {
    "Routes": {
      "catalog-route": {
        "ClusterId": "catalog-cluster",
        "Match": { "Path": "/api/catalog/{**catch-all}" },
        "Transforms": [{ "PathRemovePrefix": "/api/catalog" }]
      },
      "orders-route": {
        "ClusterId": "orders-cluster",
        "AuthorizationPolicy": "authenticated",
        "Match": { "Path": "/api/orders/{**catch-all}" },
        "Transforms": [{ "PathRemovePrefix": "/api/orders" }]
      },
      "identity-route": {
        "ClusterId": "identity-cluster",
        "Match": { "Path": "/api/identity/{**catch-all}" },
        "Transforms": [{ "PathRemovePrefix": "/api/identity" }]
      },
      "loyalty-route": {
        "ClusterId": "loyalty-cluster",
        "AuthorizationPolicy": "authenticated",
        "Match": { "Path": "/api/loyalty/{**catch-all}" },
        "Transforms": [{ "PathRemovePrefix": "/api/loyalty" }]
      },
      "location-route": {
        "ClusterId": "location-cluster",
        "Match": { "Path": "/api/location/{**catch-all}" },
        "Transforms": [{ "PathRemovePrefix": "/api/location" }]
      }
    },
    "Clusters": {
      "catalog-cluster": {
        "Destinations": {
          "destination1": { "Address": "https+http://catalog-service" }
        }
      },
      "orders-cluster": {
        "Destinations": {
          "destination1": { "Address": "https+http://order-service" }
        }
      },
      "identity-cluster": {
        "Destinations": {
          "destination1": { "Address": "https+http://identity-service" }
        }
      },
      "loyalty-cluster": {
        "Destinations": {
          "destination1": { "Address": "https+http://loyalty-service" }
        }
      },
      "location-cluster": {
        "Destinations": {
          "destination1": { "Address": "https+http://location-service" }
        }
      }
    }
  }
}
```

### Gateway Responsibilities

| Concern | Detail |
|---|---|
| **Routing** | Path-based routing to downstream services via YARP |
| **Authentication** | JWT validation; pass-through of `Authorization` header |
| **Rate Limiting** | Per-IP and per-user rate limiting using `System.Threading.RateLimiting` |
| **CORS** | Configured for Angular dev server and production domain |
| **Response Caching** | Cache catalog/location responses at the gateway level |
| **Request Aggregation** | BFF (Backend-for-Frontend) endpoints for composite views (e.g., homepage data) |

---

## 7. Microservices

### 7.1 Catalog Service

Owns the menu, products, categories, ingredients, combo offers, and seasonal drops.

| Endpoint | Method | Description |
|---|---|---|
| `/products` | GET | List all active products (juices, smoothies, shots) |
| `/products/{id}` | GET | Get product detail with ingredients and allergens |
| `/products/featured` | GET | Get featured / seasonal products |
| `/categories` | GET | List categories (Juices, Smoothies, Shots, Seasonal) |
| `/categories/{slug}/products` | GET | Products by category |
| `/combos` | GET | Active combo offers |
| `/products` | POST | Admin: create product |
| `/products/{id}` | PUT | Admin: update product |

**Domain Model Highlights:**

```csharp
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }            // e.g., "Trini Sunrise"
    public string Slug { get; set; }            // e.g., "trini-sunrise"
    public string Description { get; set; }
    public string Inspiration { get; set; }     // Caribbean cultural context
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
    public Category Category { get; set; }
    public List<ProductIngredient> Ingredients { get; set; }
    public List<DietaryTag> DietaryTags { get; set; }  // Vegan, GF, NF, DF
    public string ImageUrl { get; set; }
    public bool IsSeasonal { get; set; }
    public bool IsActive { get; set; }
    public DateOnly? AvailableFrom { get; set; }
    public DateOnly? AvailableUntil { get; set; }
}
```

### 7.2 Order Service

Manages the cart, checkout flow, payment processing (Square integration), and order lifecycle.

| Endpoint | Method | Description |
|---|---|---|
| `/cart` | GET | Get current user's cart |
| `/cart/items` | POST | Add item to cart |
| `/cart/items/{id}` | PUT | Update cart item quantity |
| `/cart/items/{id}` | DELETE | Remove item from cart |
| `/cart/apply-combo` | POST | Apply combo pricing |
| `/checkout` | POST | Process checkout (Square payment) |
| `/orders` | GET | List user's order history |
| `/orders/{id}` | GET | Get order detail with status |
| `/orders/{id}/status` | GET | Real-time order status |

**Events Published (via RabbitMQ):**

| Event | Consumer | Purpose |
|---|---|---|
| `OrderCompleted` | LoyaltyService | Auto-punch loyalty card |
| `OrderCompleted` | (future) NotificationService | Send confirmation email/SMS |
| `OrderCreated` | (future) InventoryService | Decrement stock |

### 7.3 Identity Service

Handles user registration, authentication (JWT), profile management, and role-based access.

| Endpoint | Method | Description |
|---|---|---|
| `/register` | POST | Customer registration |
| `/login` | POST | Authenticate, return JWT + refresh token |
| `/refresh` | POST | Refresh access token |
| `/profile` | GET | Get user profile |
| `/profile` | PUT | Update profile (name, preferences, allergies) |
| `/profile/avatar` | POST | Upload profile image |

**Roles:**

| Role | Access |
|---|---|
| `Customer` | Browse menu, order, manage profile, view loyalty |
| `Operator` | Manage orders, update truck location, view daily analytics |
| `Admin` | Full access: menu management, user management, reporting |

### 7.4 Loyalty Service

Implements the "Froot Fam" loyalty program with digital punch cards, rewards, birthday freebies, and referrals.

| Endpoint | Method | Description |
|---|---|---|
| `/card` | GET | Get user's loyalty card (punches, progress) |
| `/rewards` | GET | List available rewards |
| `/rewards/{id}/redeem` | POST | Redeem a reward |
| `/referral/code` | GET | Get user's referral code |
| `/referral/apply` | POST | Apply referral code (both get $3 off) |
| `/card/history` | GET | Punch and reward history |

**Loyalty Rules:**

- 1 punch per qualifying order (min $8 spend)
- 8 punches = 1 free juice (any regular size)
- Birthday reward: free smoothie (auto-applied in birthday month)
- Referral: $3 off for both referrer and referee on next order

### 7.5 Location Service

Manages real-time truck GPS positioning, operating schedules, and event/catering bookings.

| Endpoint | Method | Description |
|---|---|---|
| `/truck/current` | GET | Current truck location + ETA to close |
| `/truck/update` | POST | Operator: update GPS coordinates |
| `/schedule` | GET | Weekly operating schedule |
| `/schedule/today` | GET | Today's schedule with location details |
| `/events` | GET | Upcoming events the truck will attend |
| `/events` | POST | Admin: create event booking |
| `/catering/request` | POST | Submit catering inquiry |

**SignalR Hub: `TruckLocationHub`**

Real-time WebSocket push of truck location updates to connected clients (the "Find Us" page on the Angular app).

```csharp
public class TruckLocationHub : Hub
{
    public async Task SendLocationUpdate(TruckLocationUpdate update)
    {
        await Clients.All.SendAsync("LocationUpdated", update);
    }
}
```

---

## 8. Angular Workspace

### 8.1 Workspace Configuration

The Angular workspace uses a multi-project structure with two libraries and one application.

```
angular.json projects:
  @junkfroot/api          →  projects/api          (library)
  @junkfroot/components   →  projects/components   (library)
  junk-froot              →  projects/junk-froot   (application)
```

**Path Aliases (`tsconfig.json`):**

```json
{
  "compilerOptions": {
    "paths": {
      "@junkfroot/api": ["projects/api/src/public-api.ts"],
      "@junkfroot/components": ["projects/components/src/public-api.ts"]
    }
  }
}
```

### 8.2 API Library (`@junkfroot/api`)

A pure TypeScript/Angular library with zero UI dependencies. Contains all backend communication logic.

**Responsibilities:**

| Concern | Detail |
|---|---|
| **Models** | TypeScript interfaces matching backend DTOs |
| **API Services** | Injectable services wrapping `HttpClient` calls per domain |
| **Interceptors** | Auth token injection, error handling, retry logic |
| **Configuration** | API base URL from environment, configurable via Aspire |

**Key Services:**

```typescript
// catalog-api.service.ts
@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  getProducts(): Observable<Product[]> { ... }
  getProduct(slug: string): Observable<Product> { ... }
  getCategories(): Observable<Category[]> { ... }
  getFeaturedProducts(): Observable<Product[]> { ... }
  getCombos(): Observable<ComboOffer[]> { ... }
}

// order-api.service.ts
@Injectable({ providedIn: 'root' })
export class OrderApiService {
  getCart(): Observable<Cart> { ... }
  addToCart(item: AddCartItem): Observable<Cart> { ... }
  checkout(payment: PaymentRequest): Observable<Order> { ... }
  getOrders(): Observable<Order[]> { ... }
  getOrderStatus(id: string): Observable<OrderStatus> { ... }
}

// location-api.service.ts
@Injectable({ providedIn: 'root' })
export class LocationApiService {
  getCurrentLocation(): Observable<TruckLocation> { ... }
  getSchedule(): Observable<OperatingSchedule[]> { ... }
  getEvents(): Observable<EventBooking[]> { ... }
  connectToLocationHub(): Observable<TruckLocationUpdate> { ... }  // SignalR
}
```

### 8.3 Components Library (`@junkfroot/components`)

Reusable, presentational Angular components implementing the Junkfroot design system. All components are standalone and use Angular Signals for reactivity.

**Design System Tokens (Tailwind CSS):**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'jf-black':   '#0A0A0A',
        'jf-gold':    '#C9A84C',
        'jf-mango':   '#FF9F1C',
        'jf-sorrel':  '#9B2335',
        'jf-lime':    '#7AC74F',
        'jf-coconut': '#F5F0E8',
        'jf-dark':    '#1A1A1A',
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'sans-serif'],     // Bold headings
        'body':    ['"Inter"', 'sans-serif'],           // Clean body text
        'accent':  ['"Permanent Marker"', 'cursive'],   // Streetwear energy
      },
    },
  },
}
```

**Component Inventory:**

| Category | Component | Purpose |
|---|---|---|
| **Layout** | `jf-header` | Top navigation with logo, cart icon, user menu |
| **Layout** | `jf-footer` | Footer with social links, contact, legal |
| **Layout** | `jf-nav` | Mobile-responsive navigation drawer |
| **Layout** | `jf-shell` | Main layout wrapper (header + content + footer) |
| **Product** | `jf-product-card` | Menu item card with image, name, price, tags |
| **Product** | `jf-product-list` | Filterable grid of product cards |
| **Product** | `jf-product-detail` | Full product view with ingredients and allergens |
| **Cart** | `jf-cart-drawer` | Slide-out cart panel |
| **Cart** | `jf-cart-item` | Single cart line item with quantity controls |
| **Cart** | `jf-cart-summary` | Price breakdown, combos applied, checkout CTA |
| **Loyalty** | `jf-punch-card` | Visual punch card (8 slots, filled/empty state) |
| **Loyalty** | `jf-rewards-list` | Available rewards with redeem buttons |
| **Location** | `jf-truck-map` | Google Maps / Leaflet embed with truck marker |
| **Location** | `jf-schedule-card` | Daily schedule display (location, hours) |
| **Shared** | `jf-button` | Styled button (primary/gold, secondary/outline) |
| **Shared** | `jf-badge` | Dietary tag badges (Vegan, GF, DF, NF) |
| **Shared** | `jf-loading-spinner` | Branded loading indicator |
| **Shared** | `jf-toast` | Toast notifications |

### 8.4 Application Project (`junk-froot`)

The main customer-facing web application, launched via Aspire Host.

**Route Structure:**

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '',            loadComponent: () => import('./pages/home/home.component') },
  { path: 'menu',        loadComponent: () => import('./pages/menu/menu.component') },
  { path: 'menu/:slug',  loadComponent: () => import('./pages/product/product.component') },
  { path: 'cart',         loadComponent: () => import('./pages/cart/cart.component') },
  { path: 'checkout',     loadComponent: () => import('./pages/checkout/checkout.component'),
                           canActivate: [authGuard] },
  { path: 'find-us',      loadComponent: () => import('./pages/find-us/find-us.component') },
  { path: 'loyalty',      loadComponent: () => import('./pages/loyalty/loyalty.component'),
                           canActivate: [authGuard] },
  { path: 'catering',     loadComponent: () => import('./pages/catering/catering.component') },
  { path: 'about',        loadComponent: () => import('./pages/about/about.component') },
  { path: 'account',      canActivate: [authGuard], children: [
    { path: 'profile',    loadComponent: () => import('./pages/account/profile.component') },
    { path: 'orders',     loadComponent: () => import('./pages/account/orders.component') },
  ]},
  { path: 'login',        loadComponent: () => import('./pages/account/login.component') },
];
```

**State Management (Signal Stores):**

```typescript
// cart.store.ts - using @ngrx/signals
export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({ items: [], total: 0, itemCount: 0, loading: false }),
  withMethods((store, orderApi = inject(OrderApiService)) => ({
    async loadCart() { ... },
    async addItem(productId: string, quantity: number) { ... },
    async removeItem(itemId: string) { ... },
    async updateQuantity(itemId: string, quantity: number) { ... },
  })),
  withComputed((state) => ({
    isEmpty: computed(() => state.items().length === 0),
    formattedTotal: computed(() => `$${state.total().toFixed(2)}`),
  }))
);
```

**Pages Overview:**

| Page | Key Features |
|---|---|
| **Home** | Hero banner, featured products carousel, "Find the Truck" CTA, about blurb, Instagram feed |
| **Menu** | Category tabs (Juices / Smoothies / Shots / Seasonal), filterable grid, dietary filters |
| **Product** | Large image, full description, Caribbean inspiration story, ingredients, allergens, add-to-cart |
| **Cart** | Line items with quantity adjust, combo detection, price summary, checkout button |
| **Checkout** | Address/pickup toggle, Square payment form embed, order confirmation |
| **Find Us** | Live map with truck GPS marker, today's schedule, upcoming events calendar |
| **Loyalty** | Froot Fam punch card visualization, rewards catalog, referral code share |
| **Catering** | Inquiry form (date, headcount, event type, message) |
| **About** | Founders' story, Caribbean heritage, mission/values, community impact |
| **Account** | Profile management, order history with status tracking |

### 8.5 Aspire Integration for Angular

The Angular app is served via Aspire's `AddNpmApp` and receives API Gateway URL through environment injection.

```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: '', // Injected by Aspire via proxy.conf.js
};
```

```javascript
// proxy.conf.js
module.exports = {
  "/api": {
    target: process.env["services__api-gateway__https__0"]
         || process.env["services__api-gateway__http__0"]
         || "https://localhost:5100",
    secure: false,
    changeOrigin: true,
  }
};
```

---

## 9. Data Architecture

### Database-per-Service Strategy

Each microservice owns its database schema. No cross-service database joins.

| Service | Database | Key Tables |
|---|---|---|
| **CatalogService** | `catalog_db` | `products`, `categories`, `ingredients`, `product_ingredients`, `dietary_tags`, `combo_offers`, `seasonal_drops` |
| **OrderService** | `orders_db` | `orders`, `order_items`, `carts`, `cart_items`, `payments` |
| **IdentityService** | `identity_db` | `users`, `roles`, `user_roles`, `customer_profiles`, `refresh_tokens` |
| **LoyaltyService** | `loyalty_db` | `loyalty_cards`, `punches`, `rewards`, `reward_redemptions`, `referrals` |
| **LocationService** | `location_db` | `truck_locations`, `operating_schedules`, `event_bookings`, `catering_requests` |

### Caching Strategy (Redis)

| Key Pattern | Service | TTL | Purpose |
|---|---|---|---|
| `catalog:products` | Catalog | 5 min | Full product list cache |
| `catalog:featured` | Catalog | 10 min | Featured products |
| `cart:{userId}` | Orders | 24 hr | Active cart per user |
| `location:current` | Location | 30 sec | Current truck coordinates |
| `session:{token}` | Identity | Sliding 30 min | Session data |

### Inter-Service Communication

| Pattern | Technology | Use Case |
|---|---|---|
| **Synchronous** | HTTP via Aspire service discovery | Gateway-to-service, service-to-service queries |
| **Asynchronous** | RabbitMQ (MassTransit) | Order events, loyalty punching, notifications |
| **Real-time** | SignalR | Truck location push to browser clients |

---

## 10. Authentication & Authorization

### Flow

```
Browser → API Gateway → JWT Validation → Route to Service
           ↓
   Identity Service issues JWT on login/register
```

### JWT Structure

```json
{
  "sub": "user-guid",
  "email": "keisha@example.com",
  "name": "Keisha Thompson",
  "role": "Customer",
  "loyalty_id": "froot-fam-guid",
  "iat": 1740000000,
  "exp": 1740003600
}
```

### Token Lifecycle

| Token | Lifetime | Storage |
|---|---|---|
| Access Token (JWT) | 1 hour | In-memory (Angular) |
| Refresh Token | 7 days | HttpOnly cookie |

---

## 11. Observability & Monitoring

All services export telemetry via ServiceDefaults OpenTelemetry configuration.

### Aspire Dashboard

The built-in Aspire dashboard (available at `https://localhost:18888` in development) provides:

- **Service graph** with health status
- **Distributed traces** across all services
- **Structured logs** with correlation IDs
- **Metrics** (request rates, latencies, error rates)
- **Resource status** (PostgreSQL, Redis, RabbitMQ)

### Custom Metrics

| Metric | Service | Type | Description |
|---|---|---|---|
| `junkfroot.orders.total` | OrderService | Counter | Total orders placed |
| `junkfroot.orders.revenue` | OrderService | Histogram | Revenue per order |
| `junkfroot.catalog.views` | CatalogService | Counter | Product page views |
| `junkfroot.loyalty.punches` | LoyaltyService | Counter | Loyalty punches issued |
| `junkfroot.loyalty.redemptions` | LoyaltyService | Counter | Rewards redeemed |
| `junkfroot.location.updates` | LocationService | Counter | GPS updates received |

---

## 12. Deployment Strategy

### Development (Local)

```bash
# Single command launches everything
dotnet run --project src/Junkfroot.AppHost
```

Aspire automatically provisions PostgreSQL, Redis, and RabbitMQ as containers and launches all services + the Angular dev server.

### Staging / Production

| Component | Target |
|---|---|
| **Container Runtime** | Azure Container Apps (Aspire native deployment) |
| **Database** | Azure Database for PostgreSQL Flexible Server |
| **Cache** | Azure Cache for Redis |
| **Messaging** | Azure Service Bus (swap from RabbitMQ) |
| **Blob Storage** | Azure Blob Storage |
| **CDN** | Azure Front Door (Angular static assets) |
| **CI/CD** | GitHub Actions → Azure Container Registry → ACA |

### Aspire Deployment Manifest

```bash
# Generate deployment manifest
dotnet run --project src/Junkfroot.AppHost -- --publisher manifest --output-path ./manifest.json

# Deploy to Azure Container Apps
azd init
azd up
```

---

## 13. Implementation Phases

### Phase 1 - Foundation (Weeks 1-3)

- [ ] Initialize .NET Aspire solution structure
- [ ] Create `Junkfroot.AppHost` with PostgreSQL + Redis
- [ ] Create `Junkfroot.ServiceDefaults` with health checks and OpenTelemetry
- [ ] Create `Junkfroot.ApiGateway` with YARP base configuration
- [ ] Scaffold `Junkfroot.CatalogService` with EF Core + seed data (full menu)
- [ ] Scaffold `Junkfroot.IdentityService` with registration/login/JWT
- [ ] Initialize Angular workspace with `@junkfroot/api` and `@junkfroot/components` libraries
- [ ] Set up Tailwind CSS with Junkfroot design tokens
- [ ] Build `jf-shell`, `jf-header`, `jf-footer` layout components

### Phase 2 - Menu & Ordering (Weeks 4-6)

- [ ] Complete Catalog Service endpoints (products, categories, combos, seasonal)
- [ ] Build Angular menu page with category tabs and dietary filters
- [ ] Build product detail page with Caribbean inspiration story
- [ ] Scaffold `Junkfroot.OrderService` with cart and checkout
- [ ] Build cart drawer and checkout components
- [ ] Integrate Square payment processing
- [ ] Add RabbitMQ for order events
- [ ] Build order history and status tracking

### Phase 3 - Loyalty & Location (Weeks 7-9)

- [ ] Scaffold `Junkfroot.LoyaltyService` with Froot Fam program
- [ ] Build loyalty punch card visualization component
- [ ] Implement `OrderCompleted` consumer for auto-punching
- [ ] Build referral code system
- [ ] Scaffold `Junkfroot.LocationService` with GPS and scheduling
- [ ] Build truck map component (Leaflet/Google Maps)
- [ ] Implement SignalR hub for real-time location updates
- [ ] Build event calendar and catering request form

### Phase 4 - Polish & Launch (Weeks 10-12)

- [ ] Build home page with hero, featured products, and Find Us CTA
- [ ] Build about page with founders' story and community impact
- [ ] Responsive design pass (mobile-first for on-the-go customers)
- [ ] Performance optimization (lazy loading, image optimization, SSR consideration)
- [ ] Integration testing across all services
- [ ] Configure Azure Container Apps deployment via Aspire
- [ ] Load testing and security audit
- [ ] Production deployment

---

*This implementation design was prepared in February 2026 for the Junkfroot digital platform, aligning with the business plan's Phase 1 (Launch & Prove) and Phase 2 (Grow & Optimize) growth roadmap.*

**Junkfroot Inc. - Real Juice. Real Culture. Real Tech.**
