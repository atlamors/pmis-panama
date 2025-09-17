var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "scheduling" }));

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.Title = "Scheduling API";
});

app.Run();


