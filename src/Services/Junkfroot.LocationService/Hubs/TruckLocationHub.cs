using Junkfroot.LocationService.Domain;
using Microsoft.AspNetCore.SignalR;

namespace Junkfroot.LocationService.Hubs;

public class TruckLocationHub : Hub
{
    public async Task SendLocationUpdate(TruckLocationUpdate update)
    {
        await Clients.All.SendAsync("LocationUpdated", update);
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}
