using Reservacion.Domain.Enums;

namespace Reservacion.Application.DTOs;

public record AppointmentResponse(
    Guid Id,
    Guid ServiceItemId,
    string CustomerName,
    string CustomerEmail,
    DateTime ScheduledAt,
    DateTime EndsAt,
    int DurationMinutes,
    AppointmentStatus Status,
    string? Notes,
    DateTime CreatedAt);

public record CreateAppointmentRequest(
    Guid ServiceItemId,
    string CustomerName,
    string CustomerEmail,
    DateTime ScheduledAt,
    string? Notes = null);

public record RescheduleAppointmentRequest(DateTime NewScheduledAt);
