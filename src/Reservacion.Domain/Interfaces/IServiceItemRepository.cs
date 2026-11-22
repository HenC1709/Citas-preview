using Reservacion.Domain.Entities;

namespace Reservacion.Domain.Interfaces;

public interface IServiceItemRepository
{
    Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(ServiceItem serviceItem, CancellationToken cancellationToken = default);
}
