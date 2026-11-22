using Microsoft.AspNetCore.Mvc;
using Reservacion.Application.DTOs;
using Reservacion.Application.Interfaces;

namespace Reservacion.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController(IAppointmentService appointmentService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AppointmentResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var appointments = await appointmentService.GetAllAsync(cancellationToken);
        return Ok(appointments);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AppointmentResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var appointment = await appointmentService.GetByIdAsync(id, cancellationToken);
        return Ok(appointment);
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentResponse>> Create(
        CreateAppointmentRequest request,
        CancellationToken cancellationToken)
    {
        var created = await appointmentService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPatch("{id:guid}/confirm")]
    public async Task<ActionResult<AppointmentResponse>> Confirm(Guid id, CancellationToken cancellationToken)
    {
        var confirmed = await appointmentService.ConfirmAsync(id, cancellationToken);
        return Ok(confirmed);
    }

    [HttpPatch("{id:guid}/cancel")]
    public async Task<ActionResult<AppointmentResponse>> Cancel(Guid id, CancellationToken cancellationToken)
    {
        var cancelled = await appointmentService.CancelAsync(id, cancellationToken);
        return Ok(cancelled);
    }

    [HttpPut("{id:guid}/reschedule")]
    public async Task<ActionResult<AppointmentResponse>> Reschedule(
        Guid id,
        RescheduleAppointmentRequest request,
        CancellationToken cancellationToken)
    {
        var rescheduled = await appointmentService.RescheduleAsync(id, request, cancellationToken);
        return Ok(rescheduled);
    }
}
