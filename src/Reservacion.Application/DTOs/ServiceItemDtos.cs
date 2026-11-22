namespace Reservacion.Application.DTOs;

public record ServiceItemResponse(
    Guid Id,
    string Name,
    string Description,
    int DurationMinutes,
    decimal Price,
    bool IsActive);

public record CreateServiceItemRequest(
    string Name,
    string Description,
    int DurationMinutes,
    decimal Price);
