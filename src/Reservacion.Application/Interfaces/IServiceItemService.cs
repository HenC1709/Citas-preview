using Reservacion.Application.DTOs;

namespace Reservacion.Application.Interfaces;

public interface IServiceItemService
{
    Task<IReadOnlyList<ServiceItemResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceItemResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ServiceItemResponse> CreateAsync(CreateServiceItemRequest request, CancellationToken cancellationToken = default);
}
