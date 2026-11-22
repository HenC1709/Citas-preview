using Reservacion.Domain.Entities;
using Reservacion.Domain.Enums;
using Reservacion.Domain.Interfaces;

namespace Reservacion.Infrastructure.Persistence;

/// <summary>
/// Implementación en memoria para pruebas rápidas.
/// Puede reemplazarse por un repositorio con Entity Framework Core sin modificar Domain ni Application.
/// </summary>
public class InMemoryAppointmentRepository : IAppointmentRepository
{
    private readonly Lock _lock = new();
    private readonly Dictionary<Guid, Appointment> _appointments = [];

    public Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            return Task.FromResult(_appointments.GetValueOrDefault(id));
        }
    }

    public Task<IReadOnlyList<Appointment>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            IReadOnlyList<Appointment> result = [.. _appointments.Values.OrderBy(a => a.ScheduledAt)];
            return Task.FromResult(result);
        }
    }

    public Task<bool> HasOverlappingAsync(
        DateTime start,
        DateTime end,
        Guid? excludeAppointmentId = null,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            var overlaps = _appointments.Values.Any(a =>
                a.Status != AppointmentStatus.Cancelled &&
                (excludeAppointmentId is null || a.Id != excludeAppointmentId.Value) &&
                a.ScheduledAt < end &&
                start < a.EndsAt);

            return Task.FromResult(overlaps);
        }
    }

    public Task AddAsync(Appointment appointment, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            _appointments[appointment.Id] = appointment;
        }

        return Task.CompletedTask;
    }

    public Task UpdateAsync(Appointment appointment, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            _appointments[appointment.Id] = appointment;
        }

        return Task.CompletedTask;
    }
}
