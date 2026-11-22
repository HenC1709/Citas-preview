using Reservacion.Application.DTOs;

namespace Reservacion.Application.Interfaces;

public interface IAppointmentService
{
    Task<IReadOnlyList<AppointmentResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AppointmentResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request, CancellationToken cancellationToken = default);
    Task<AppointmentResponse> ConfirmAsync(Guid id, CancellationToken cancellationToken = default);
    Task<AppointmentResponse> CancelAsync(Guid id, CancellationToken cancellationToken = default);
    Task<AppointmentResponse> RescheduleAsync(Guid id, RescheduleAppointmentRequest request, CancellationToken cancellationToken = default);
}
