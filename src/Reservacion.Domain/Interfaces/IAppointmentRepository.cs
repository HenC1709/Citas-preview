using Reservacion.Domain.Entities;

namespace Reservacion.Domain.Interfaces;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Appointment>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<bool> HasOverlappingAsync(
        DateTime start,
        DateTime end,
        Guid? excludeAppointmentId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(Appointment appointment, CancellationToken cancellationToken = default);
    Task UpdateAsync(Appointment appointment, CancellationToken cancellationToken = default);
}
