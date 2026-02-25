using Aspire.Hosting.Testing;
using Xunit;

namespace Junkfroot.Integration.Tests;

public class IntegrationTestBase : IAsyncLifetime
{
    protected DistributedApplication? App { get; private set; }

    public async Task InitializeAsync()
    {
        var appHost = await DistributedApplicationTestingBuilder
            .CreateAsync<Projects.Junkfroot_AppHost>();

        App = await appHost.BuildAsync();
        await App.StartAsync();
    }

    public async Task DisposeAsync()
    {
        if (App is not null)
        {
            await App.DisposeAsync();
        }
    }
}
