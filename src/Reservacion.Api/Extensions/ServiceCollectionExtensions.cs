using Reservacion.Application.Interfaces;
using Reservacion.Application.Services;
using Reservacion.Domain.Interfaces;
using Reservacion.Infrastructure.Persistence;

namespace Reservacion.Api.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddReservacionServices()
        {
            // Singletons porque los repositorios en memoria mantienen el estado entre peticiones.
            // Al migrar a una base de datos (por ejemplo EF Core), cambiar a AddScoped.
            services.AddSingleton<IServiceItemRepository, InMemoryServiceItemRepository>();
            services.AddSingleton<IAppointmentRepository, InMemoryAppointmentRepository>();

            services.AddScoped<IServiceItemService, ServiceItemService>();
            services.AddScoped<IAppointmentService, AppointmentService>();

            return services;
        }
    }
}
