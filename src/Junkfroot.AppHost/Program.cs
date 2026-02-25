var builder = DistributedApplication.CreateBuilder(args);

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
builder.AddNpmApp("junk-froot-web", "../Web/projects/junk-froot")
    .WithReference(apiGateway)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
