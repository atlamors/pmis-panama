var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy().LoadFromMemory(
    new[]
    {
        new Yarp.ReverseProxy.Configuration.RouteConfig()
        {
            RouteId = "scheduling",
            ClusterId = "schedulingCluster",
            Match = new Yarp.ReverseProxy.Configuration.RouteMatch
            {
                Path = "/api/scheduling/{**catchall}"
            },
            Transforms = new[]
            {
                new System.Collections.Generic.Dictionary<string, string>
                {
                    { "PathPattern", "/{**catchall}" }
                }
            }
        }
    },
    new[]
    {
        new Yarp.ReverseProxy.Configuration.ClusterConfig()
        {
            ClusterId = "schedulingCluster",
            Destinations = new System.Collections.Generic.Dictionary<string, Yarp.ReverseProxy.Configuration.DestinationConfig>
            {
                { "d1", new Yarp.ReverseProxy.Configuration.DestinationConfig { Address = "http://localhost:5001" } }
            }
        }
    }
);

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "api-gateway" }));
app.MapReverseProxy();

app.Run();


