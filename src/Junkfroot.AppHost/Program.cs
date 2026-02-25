var builder = DistributedApplication.CreateBuilder(args);

// ── Secrets / Parameters ────────────────────────────────────────
var jwtKey = builder.AddParameter("jwt-signing-key", secret: true);

// ── Infrastructure ──────────────────────────────────────────────
var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin();

var catalogDb  = postgres.AddDatabase("catalog-db");
var ordersDb   = postgres.AddDatabase("orders-db");
var identityDb = postgres.AddDatabase("identity-db");
var loyaltyDb  = postgres.AddDatabase("loyalty-db");
var locationDb = postgres.AddDatabase("location-db");

var redis = builder.AddRedis("redis")
    .WithRedisInsight();

var rabbitmq = builder.AddRabbitMQ("messaging")
    .WithManagementPlugin();

var blobStorage = builder.AddAzureBlobStorage("blobs");

// ── Services ────────────────────────────────────────────────────
var identityService = builder.AddProject<Projects.Junkfroot_IdentityService>("identity-service")
    .WithReference(identityDb)
    .WithReference(redis)
    .WithReference(blobStorage)
    .WithEnvironment("Jwt__Key", jwtKey);

var catalogService = builder.AddProject<Projects.Junkfroot_CatalogService>("catalog-service")
    .WithReference(catalogDb)
    .WithReference(redis)
    .WithReference(blobStorage)
    .WithEnvironment("Jwt__Key", jwtKey);

var orderService = builder.AddProject<Projects.Junkfroot_OrderService>("order-service")
    .WithReference(ordersDb)
    .WithReference(redis)
    .WithReference(rabbitmq)
    .WithEnvironment("Jwt__Key", jwtKey);

var loyaltyService = builder.AddProject<Projects.Junkfroot_LoyaltyService>("loyalty-service")
    .WithReference(loyaltyDb)
    .WithReference(rabbitmq)
    .WithEnvironment("Jwt__Key", jwtKey);

var locationService = builder.AddProject<Projects.Junkfroot_LocationService>("location-service")
    .WithReference(locationDb)
    .WithReference(redis)
    .WithEnvironment("Jwt__Key", jwtKey);

// ── API Gateway ─────────────────────────────────────────────────
var apiGateway = builder.AddProject<Projects.Junkfroot_ApiGateway>("api-gateway")
    .WithReference(identityService)
    .WithReference(catalogService)
    .WithReference(orderService)
    .WithReference(loyaltyService)
    .WithReference(locationService)
    .WithEnvironment("Jwt__Key", jwtKey);

// ── Angular Frontend ────────────────────────────────────────────
builder.AddNpmApp("junk-froot-web", "../Web/projects/junk-froot")
    .WithReference(apiGateway)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
