import { useEffect, useState, type SubmitEvent } from 'react';
import type { CreateAppointmentRequest, ServiceItem } from '../types/api';

interface AppointmentFormProps {
  services: ServiceItem[];
  onCreateAppointment: (payload: CreateAppointmentRequest) => Promise<void>;
}

function getDefaultFutureDateTime(): string {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function AppointmentForm({ services, onCreateAppointment }: AppointmentFormProps) {
  const activeServices = services.filter((s) => s.isActive);

  const [serviceItemId, setServiceItemId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [scheduledAt, setScheduledAt] = useState(getDefaultFutureDateTime);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!serviceItemId && activeServices.length > 0) {
      setServiceItemId(activeServices[0].id);
    }
  }, [activeServices, serviceItemId]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onCreateAppointment({
        serviceItemId,
        customerName,
        customerEmail,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes: notes.trim() || null,
      });

      setCustomerName('');
      setCustomerEmail('');
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <h2>Reservar nueva cita</h2>
      <p className="muted">Completa los datos para probar las validaciones del dominio</p>

      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="appointment-service">Servicio</label>
          <select
            id="appointment-service"
            required
            value={serviceItemId}
            onChange={(e) => setServiceItemId(e.target.value)}
            disabled={activeServices.length === 0}
          >
            {activeServices.length === 0 ? (
              <option value="">Sin servicios activos</option>
            ) : (
              activeServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.durationMinutes} min - ${service.price.toFixed(2)})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="field">
          <label htmlFor="customer-name">Nombre del cliente</label>
          <input
            id="customer-name"
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Ej. Ana García"
          />
        </div>

        <div className="field">
          <label htmlFor="customer-email">Correo electrónico</label>
          <input
            id="customer-email"
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="ana@ejemplo.com"
          />
        </div>

        <div className="field">
          <label htmlFor="scheduled-at">Fecha y hora</label>
          <input
            id="scheduled-at"
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="appointment-notes">Notas (opcional)</label>
          <textarea
            id="appointment-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Comentarios adicionales..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || activeServices.length === 0}
        >
          {submitting ? 'Reservando...' : 'Crear cita'}
        </button>
      </form>
    </section>
  );
}
