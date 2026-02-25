# Junkfroot

A full-stack digital platform for a mobile fresh juice brand serving the Greater Toronto Area. Built with .NET Aspire microservices and Angular, the platform powers online ordering, real-time truck tracking, a loyalty program, and an operations dashboard.

## Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌────────────────────────────┐
│  Angular SPA │─────▶│  API Gateway     │─────▶│  Microservices             │
│  (Port 4200) │      │  (YARP)          │      │                            │
└─────────────┘      └──────────────────┘      │  ├─ Catalog Service         │
                                                │  ├─ Order Service           │
                                                │  ├─ Identity Service        │
                                                │  ├─ Loyalty Service         │
                                                │  └─ Location Service        │
                                                └────────────────────────────┘
                                                         │
                                    ┌────────────────────┼────────────────────┐
                                    │                    │                    │
                               PostgreSQL (×5)        Redis           RabbitMQ
```

**Backend:** .NET 9 / Aspire 9.1, Minimal APIs, Entity Framework Core, YARP reverse proxy, JWT auth, OpenTelemetry

**Frontend:** Angular 21, TypeScript, Tailwind CSS, SignalR, Signal-based state management, Playwright E2E tests

**Infrastructure:** PostgreSQL, Redis, RabbitMQ, Azure Blob Storage — all orchestrated via .NET Aspire

## Project Structure

```
src/
├── Junkfroot.AppHost/           # .NET Aspire orchestration host
├── Junkfroot.ServiceDefaults/   # Shared service configuration
├── Junkfroot.ApiGateway/        # YARP reverse proxy + auth
├── Services/
│   ├── Junkfroot.CatalogService/    # Products, categories, menu
│   ├── Junkfroot.OrderService/      # Order creation & tracking
│   ├── Junkfroot.IdentityService/   # Auth, profiles, JWT
│   ├── Junkfroot.LoyaltyService/    # Punch card, rewards, referrals
│   └── Junkfroot.LocationService/   # Real-time truck GPS & schedule
└── Web/
    └── projects/
        ├── api/              # Shared API client library
        ├── components/       # Reusable UI component library
        └── junk-froot/       # Main Angular application

tests/
├── Junkfroot.CatalogService.Tests/
├── Junkfroot.OrderService.Tests/
├── Junkfroot.IdentityService.Tests/
├── Junkfroot.LoyaltyService.Tests/
├── Junkfroot.LocationService.Tests/
└── Junkfroot.Integration.Tests/

docs/
├── Implementation_Design.md     # Technical architecture
└── Junkfroot_Business_Plan.md   # Business model & strategy
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download) (9.0.308+)
- [Node.js](https://nodejs.org/) with npm 10.9+
- [Docker](https://www.docker.com/) (for Aspire-managed infrastructure)

## Getting Started

### Run the full stack

```bash
# From the repo root — starts all services, databases, and the Angular frontend
cd src/Junkfroot.AppHost
dotnet run
```

The Aspire host orchestrates everything: PostgreSQL (5 databases), Redis, RabbitMQ, all microservices, the API gateway, and the Angular dev server. Open the Aspire dashboard URL printed in the console to see all resources.

### Run the frontend independently

```bash
cd src/Web
npm install
npm start          # http://localhost:4200
```

### Run tests

```bash
# .NET unit & integration tests
dotnet test

# Playwright E2E tests
cd src/Web
npx playwright test
```

## API Routes

All client requests go through the API Gateway, which routes to the appropriate microservice:

| Route | Service | Auth |
|-------|---------|------|
| `/api/catalog/*` | Catalog Service | No |
| `/api/orders/*` | Order Service | Yes |
| `/api/identity/*` | Identity Service | No |
| `/api/loyalty/*` | Loyalty Service | Yes |
| `/api/location/*` | Location Service | No |

Rate limiting is set to 100 requests/minute per client.

## Key Features

- **Online Ordering** — Pre-orders, subscriptions, juice cleanses
- **Menu Management** — Products, seasonal drops, combos, pricing
- **Froot Fam Loyalty** — Digital punch card, rewards, referral tracking
- **Live Truck Tracking** — Real-time GPS via SignalR
- **Event & Catering** — Booking and management
- **Operations Dashboard** — Inventory, sales analytics
