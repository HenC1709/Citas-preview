using Reservacion.Application.DTOs;
using Reservacion.Application.Interfaces;
using Reservacion.Application.Mappings;
using Reservacion.Domain.Entities;
using Reservacion.Domain.Interfaces;

namespace Reservacion.Application.Services;

public class ServiceItemService(IServiceItemRepository serviceItemRepository) : IServiceItemService
{
    public async Task<IReadOnlyList<ServiceItemResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var services = await serviceItemRepository.GetAllAsync(cancellationToken);
        return [.. services.Select(s => s.ToResponse())];
    }

    public async Task<ServiceItemResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var service = await serviceItemRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"No se encontró el servicio con ID '{id}'.");

        return service.ToResponse();
    }

    public async Task<ServiceItemResponse> CreateAsync(
        CreateServiceItemRequest request,
        CancellationToken cancellationToken = default)
    {
        var service = new ServiceItem(
            request.Name,
            request.Description,
            request.DurationMinutes,
            request.Price);

        await serviceItemRepository.AddAsync(service, cancellationToken);
        return service.ToResponse();
    }
}
