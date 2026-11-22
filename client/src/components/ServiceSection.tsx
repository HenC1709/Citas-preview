import { useState, type SubmitEvent } from 'react';
import type { CreateServiceItemRequest, ServiceItem } from '../types/api';

interface ServiceSectionProps {
  services: ServiceItem[];
  canManage?: boolean;
  onCreateService?: (payload: CreateServiceItemRequest) => Promise<void>;
}

export function ServiceSection({
  services,
  canManage = false,
  onCreateService,
}: ServiceSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [price, setPrice] = useState('50');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onCreateService) return;

    setSubmitting(true);

    try {
      await onCreateService({
        name,
        description,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
      });

      setName('');
      setDescription('');
      setDurationMinutes('30');
      setPrice('50');
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Servicios disponibles</h2>
          <p className="muted">Catálogo cargado desde la API</p>
        </div>
        {canManage && onCreateService && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? 'Cerrar' : '+ Nuevo servicio'}
          </button>
        )}
      </div>

      {canManage && showForm && (
        <form className="subform" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="service-name">Nombre</label>
            <input
              id="service-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Consulta Express"
            />
          </div>

          <div className="field">
            <label htmlFor="service-description">Descripción</label>
            <input
              id="service-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve detalle del servicio"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="service-duration">Duración (min)</label>
              <input
                id="service-duration"
                type="number"
                min={1}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="service-price">Precio</label>
              <input
                id="service-price"
                type="number"
                min={0}
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar servicio'}
          </button>
        </form>
      )}

      {services.length === 0 ? (
        <p className="empty">No hay servicios registrados.</p>
      ) : (
        <ul className="service-list">
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
  );
}
