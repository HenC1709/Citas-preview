using Microsoft.AspNetCore.Mvc;
using Reservacion.Application.DTOs;
using Reservacion.Application.Interfaces;

namespace Reservacion.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController(IServiceItemService serviceItemService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServiceItemResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var services = await serviceItemService.GetAllAsync(cancellationToken);
        return Ok(services);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceItemResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var service = await serviceItemService.GetByIdAsync(id, cancellationToken);
        return Ok(service);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceItemResponse>> Create(
        CreateServiceItemRequest request,
        CancellationToken cancellationToken)
    {
        var created = await serviceItemService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
