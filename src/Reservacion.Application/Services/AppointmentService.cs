using Reservacion.Application.DTOs;
using Reservacion.Application.Interfaces;
using Reservacion.Application.Mappings;
using Reservacion.Domain.Entities;
using Reservacion.Domain.Exceptions;
using Reservacion.Domain.Interfaces;

namespace Reservacion.Application.Services;

public class AppointmentService(
    IAppointmentRepository appointmentRepository,
    IServiceItemRepository serviceItemRepository) : IAppointmentService
{
    public async Task<IReadOnlyList<AppointmentResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var appointments = await appointmentRepository.GetAllAsync(cancellationToken);
        return [.. appointments.Select(a => a.ToResponse())];
    }

    public async Task<AppointmentResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var appointment = await GetExistingAppointmentAsync(id, cancellationToken);
        return appointment.ToResponse();
    }

    public async Task<AppointmentResponse> CreateAsync(
        CreateAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var service = await serviceItemRepository.GetByIdAsync(request.ServiceItemId, cancellationToken)
            ?? throw new KeyNotFoundException($"No se encontró el servicio con ID '{request.ServiceItemId}'.");

        if (!service.IsActive)
            throw new DomainException("El servicio seleccionado no está disponible actualmente.");

        if (request.ScheduledAt <= DateTime.UtcNow)
            throw new DomainException("La fecha de la cita debe ser en el futuro.");

        var endsAt = request.ScheduledAt.AddMinutes(service.DurationMinutes);
        var hasOverlap = await appointmentRepository.HasOverlappingAsync(
            request.ScheduledAt,
            endsAt,
            cancellationToken: cancellationToken);

        if (hasOverlap)
            throw new DomainException("Ya existe una cita programada en ese horario.");

        var appointment = new Appointment(
            service.Id,
            request.CustomerName,
            request.CustomerEmail,
            request.ScheduledAt,
            service.DurationMinutes,
            request.Notes);

        await appointmentRepository.AddAsync(appointment, cancellationToken);
        return appointment.ToResponse();
    }

    public async Task<AppointmentResponse> ConfirmAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var appointment = await GetExistingAppointmentAsync(id, cancellationToken);
        appointment.Confirm();

        await appointmentRepository.UpdateAsync(appointment, cancellationToken);
        return appointment.ToResponse();
    }

    public async Task<AppointmentResponse> CancelAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var appointment = await GetExistingAppointmentAsync(id, cancellationToken);
        appointment.Cancel();

        await appointmentRepository.UpdateAsync(appointment, cancellationToken);
        return appointment.ToResponse();
    }

    public async Task<AppointmentResponse> RescheduleAsync(
        Guid id,
        RescheduleAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await GetExistingAppointmentAsync(id, cancellationToken);

        var newEnd = request.NewScheduledAt.AddMinutes(appointment.DurationMinutes);
        var hasOverlap = await appointmentRepository.HasOverlappingAsync(
            request.NewScheduledAt,
            newEnd,
            excludeAppointmentId: appointment.Id,
            cancellationToken);

        if (hasOverlap)
            throw new DomainException("Ya existe una cita programada en el nuevo horario.");

        appointment.Reschedule(request.NewScheduledAt);
        await appointmentRepository.UpdateAsync(appointment, cancellationToken);

        return appointment.ToResponse();
    }

    private async Task<Appointment> GetExistingAppointmentAsync(Guid id, CancellationToken cancellationToken)
    {
        return await appointmentRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"No se encontró la cita con ID '{id}'.");
    }
}
