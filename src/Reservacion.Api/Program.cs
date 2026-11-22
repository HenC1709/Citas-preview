using System.Text.Json.Serialization;
using Reservacion.Api.Extensions;
using Reservacion.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddReservacionServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("FrontendDev");
app.MapControllers();

app.Run();
