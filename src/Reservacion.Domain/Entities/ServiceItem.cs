using Reservacion.Domain.Exceptions;

namespace Reservacion.Domain.Entities;

public class ServiceItem
{
    public Guid Id { get; private set; }

    public string Name
    {
        get;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("El nombre del servicio es obligatorio.");

            field = value.Trim();
        }
    } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public int DurationMinutes
    {
        get;
        private set
        {
            if (value <= 0)
                throw new DomainException("La duración del servicio debe ser mayor a cero minutos.");

            field = value;
        }
    }

    public decimal Price
    {
        get;
        private set
        {
            if (value < 0)
                throw new DomainException("El precio del servicio no puede ser negativo.");

            field = value;
        }
    }

    public bool IsActive { get; private set; }

    public ServiceItem(string name, string description, int durationMinutes, decimal price, Guid? id = null)
    {
        Id = id is null || id == Guid.Empty ? Guid.NewGuid() : id.Value;
        Name = name;
        Description = description?.Trim() ?? string.Empty;
        DurationMinutes = durationMinutes;
        Price = price;
        IsActive = true;
    }

    public void UpdateDetails(string name, string description, int durationMinutes, decimal price)
    {
        Name = name;
        Description = description?.Trim() ?? string.Empty;
        DurationMinutes = durationMinutes;
        Price = price;
    }

    public void Deactivate() => IsActive = false;
}
