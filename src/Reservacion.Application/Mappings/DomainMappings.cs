using Reservacion.Application.DTOs;
using Reservacion.Domain.Entities;

namespace Reservacion.Application.Mappings;

public static class DomainMappings
{
    extension(ServiceItem service)
    {
        public ServiceItemResponse ToResponse() => new(
            service.Id,
            service.Name,
            service.Description,
            service.DurationMinutes,
            service.Price,
            service.IsActive);
    }

    extension(Appointment appointment)
    {
        public AppointmentResponse ToResponse() => new(
            appointment.Id,
            appointment.ServiceItemId,
            appointment.CustomerName,
            appointment.CustomerEmail,
            appointment.ScheduledAt,
            appointment.EndsAt,
            appointment.DurationMinutes,
            appointment.Status,
            appointment.Notes,
            appointment.CreatedAt);
    }
}
