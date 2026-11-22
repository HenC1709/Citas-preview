import type { ServiceItem } from '../types/api';

interface BusinessInfoProps {
  services: ServiceItem[];
  onGoToBooking: () => void;
}

export function BusinessInfo({ services, onGoToBooking }: BusinessInfoProps) {
  return (
    <div className="info-grid">
      <section className="card">
        <h2>Información del local</h2>
        <p className="muted">
          Espacio genérico de atención al cliente con agenda previa por servicio.
        </p>

        <div className="info-list">
          <div className="info-item">
            <span className="detail-label">Horario de atención</span>
            <p>Lunes a Viernes: 09:00 – 18:00</p>
            <p>Sábados: 09:00 – 13:00</p>
          </div>

          <div className="info-item">
            <span className="detail-label">Ubicación y contacto</span>
            <p>Av. Principal 123, Local 4</p>
            <p>contacto@local-ejemplo.com · +00 555 123 456</p>
          </div>

          <div className="info-item">
            <span className="detail-label">Política de reservas</span>
            <p>
              Te recomendamos llegar 10 minutos antes de tu cita. Las reservas inician en estado
              pendiente hasta ser confirmadas por el local.
            </p>
          </div>
        </div>

        <button type="button" className="btn btn-primary" onClick={onGoToBooking}>
          Reservar una cita
        </button>
      </section>

      <section className="card">
        <h2>Servicios y tarifas</h2>
        <p className="muted">Catálogo vigente cargado desde la API</p>

        {services.length === 0 ? (
          <p className="empty">No hay servicios disponibles por el momento.</p>
        ) : (
          <ul className="service-list" style={{ marginTop: '1rem' }}>
            {services.map((service) => (
              <li key={service.id} className="service-item">
                <div>
                  <strong>{service.name}</strong>
                  {service.description && <p className="muted">{service.description}</p>}
                </div>
                <div className="service-meta">
                  <span>{service.durationMinutes} min</span>
                  <strong>${service.price.toFixed(2)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
