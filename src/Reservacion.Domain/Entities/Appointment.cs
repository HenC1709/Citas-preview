using Reservacion.Domain.Enums;
using Reservacion.Domain.Exceptions;

namespace Reservacion.Domain.Entities;

public class Appointment
{
    public Guid Id { get; private set; }
    public Guid ServiceItemId { get; private set; }

    public string CustomerName
    {
        get;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("El nombre del cliente es obligatorio.");

            field = value.Trim();
        }
    } = string.Empty;

    public string CustomerEmail
    {
        get;
        private set
        {
            if (string.IsNullOrWhiteSpace(value) || !value.Contains('@'))
                throw new DomainException("El correo del cliente no es válido.");

            field = value.Trim();
        }
    } = string.Empty;

    public DateTime ScheduledAt { get; private set; }

    public int DurationMinutes
    {
        get;
        private set
        {
            if (value <= 0)
                throw new DomainException("La duración de la cita debe ser mayor a cero minutos.");

            field = value;
        }
    }

    public AppointmentStatus Status { get; private set; }
    public string? Notes { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public DateTime EndsAt => ScheduledAt.AddMinutes(DurationMinutes);

    public Appointment(
        Guid serviceItemId,
        string customerName,
        string customerEmail,
        DateTime scheduledAt,
        int durationMinutes,
        string? notes = null)
    {
        if (serviceItemId == Guid.Empty)
            throw new DomainException("El servicio asociado es obligatorio.");

        if (scheduledAt <= DateTime.UtcNow)
            throw new DomainException("La fecha de la cita debe ser en el futuro.");

        Id = Guid.NewGuid();
        ServiceItemId = serviceItemId;
        CustomerName = customerName;
        CustomerEmail = customerEmail;
        ScheduledAt = scheduledAt;
        DurationMinutes = durationMinutes;
        Status = AppointmentStatus.Pending;
        Notes = string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
        CreatedAt = DateTime.UtcNow;
    }

    public void Confirm()
    {
        if (Status != AppointmentStatus.Pending)
            throw new DomainException($"Solo se pueden confirmar citas pendientes. Estado actual: {Status}.");

        Status = AppointmentStatus.Confirmed;
    }

    public void Cancel()
    {
        if (Status is AppointmentStatus.Cancelled or AppointmentStatus.Completed)
            throw new DomainException($"No se puede cancelar una cita en estado {Status}.");

        Status = AppointmentStatus.Cancelled;
    }

    public void Reschedule(DateTime newScheduledAt)
    {
        if (Status is AppointmentStatus.Cancelled or AppointmentStatus.Completed)
            throw new DomainException($"No se puede reprogramar una cita en estado {Status}.");

        if (newScheduledAt <= DateTime.UtcNow)
            throw new DomainException("La nueva fecha de la cita debe ser en el futuro.");

        ScheduledAt = newScheduledAt;
    }
}
