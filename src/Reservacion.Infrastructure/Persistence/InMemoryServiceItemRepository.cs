using Reservacion.Domain.Entities;
using Reservacion.Domain.Interfaces;

namespace Reservacion.Infrastructure.Persistence;

/// <summary>
/// Implementación en memoria para pruebas rápidas.
/// Puede reemplazarse por un repositorio con Entity Framework Core sin modificar Domain ni Application.
/// </summary>
public class InMemoryServiceItemRepository : IServiceItemRepository
{
    private readonly Lock _lock = new();
    private readonly Dictionary<Guid, ServiceItem> _services = [];

    public InMemoryServiceItemRepository()
    {
        var seed = new ServiceItem[]
        {
            new(
                "Consulta General",
                "Evaluación inicial y orientación general.",
                30,
                40.00m,
                Guid.Parse("11111111-1111-1111-1111-111111111111")),
            new(
                "Asesoría Técnica",
                "Sesión especializada para revisión detallada o soporte.",
                60,
                75.00m,
                Guid.Parse("22222222-2222-2222-2222-222222222222")),
            new(
                "Sesión de Seguimiento",
                "Control breve de avances y próximos pasos.",
                20,
                25.00m,
                Guid.Parse("33333333-3333-3333-3333-333333333333"))
        };

        foreach (var item in seed)
            _services[item.Id] = item;
    }

    public Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            return Task.FromResult(_services.GetValueOrDefault(id));
        }
    }

    public Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            IReadOnlyList<ServiceItem> result = [.. _services.Values.OrderBy(s => s.Name)];
            return Task.FromResult(result);
        }
    }

    public Task AddAsync(ServiceItem serviceItem, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            _services[serviceItem.Id] = serviceItem;
        }

        return Task.CompletedTask;
    }
}
