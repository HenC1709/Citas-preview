import { useState } from 'react';
import type { Appointment, AppointmentStatus, ServiceItem } from '../types/api';

interface AppointmentListProps {
  appointments: Appointment[];
  services: ServiceItem[];
  onConfirm: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onReschedule: (id: string, newScheduledAtIso: string) => Promise<void>;
}

const statusLabels: Record<AppointmentStatus, string> = {
  Pending: 'Pendiente',
  Confirmed: 'Confirmada',
  Cancelled: 'Cancelada',
  Completed: 'Completada',
};

function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

function toLocalDateTimeInput(isoDate: string): string {
  const date = new Date(isoDate);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function AppointmentList({
  appointments,
  services,
  onConfirm,
  onCancel,
  onReschedule,
}: AppointmentListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDateValue, setNewDateValue] = useState('');

  const serviceNameById = new Map(services.map((s) => [s.id, s.name]));

  async function runAction(id: string, action: () => Promise<void>) {
    setBusyId(id);
    try {
      await action();
    } finally {
      setBusyId(null);
    }
  }

  function startReschedule(appointment: Appointment) {
    setEditingId(appointment.id);
    setNewDateValue(toLocalDateTimeInput(appointment.scheduledAt));
  }

  async function submitReschedule(id: string) {
    if (!newDateValue) return;

    await runAction(id, async () => {
      await onReschedule(id, new Date(newDateValue).toISOString());
      setEditingId(null);
    });
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Agenda de citas</h2>
          <p className="muted">
            {appointments.length === 0
              ? 'Todavía no hay citas registradas'
              : `${appointments.length} cita(s) registrada(s)`}
          </p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <p className="empty">Crea una cita desde el formulario para probar confirmación, reprogramación y cancelación.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((appointment) => {
            const isBusy = busyId === appointment.id;
            const isFinalized =
              appointment.status === 'Cancelled' || appointment.status === 'Completed';
            const serviceName =
              serviceNameById.get(appointment.serviceItemId) ?? 'Servicio desconocido';

            return (
              <article key={appointment.id} className="appointment-card">
                <div className="appointment-top">
                  <div>
                    <h3>{appointment.customerName}</h3>
                    <p className="muted">{appointment.customerEmail}</p>
                  </div>
                  <span className={`badge badge-${appointment.status.toLowerCase()}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </div>

                <div className="appointment-details">
                  <div>
                    <span className="detail-label">Servicio:</span> {serviceName} (
                    {appointment.durationMinutes} min)
                  </div>
                  <div>
                    <span className="detail-label">Inicio:</span>{' '}
                    {formatDateTime(appointment.scheduledAt)}
                  </div>
                  <div>
                    <span className="detail-label">Fin:</span>{' '}
                    {formatDateTime(appointment.endsAt)}
                  </div>
                  {appointment.notes && (
                    <div>
                      <span className="detail-label">Notas:</span> {appointment.notes}
                    </div>
                  )}
                </div>

                {editingId === appointment.id ? (
                  <div className="reschedule-box">
                    <input
                      type="datetime-local"
                      value={newDateValue}
                      onChange={(e) => setNewDateValue(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={isBusy}
                      onClick={() => submitReschedule(appointment.id)}
                    >
                      Guardar fecha
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={isBusy}
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  !isFinalized && (
                    <div className="actions">
                      {appointment.status === 'Pending' && (
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={isBusy}
                          onClick={() => runAction(appointment.id, () => onConfirm(appointment.id))}
                        >
                          Confirmar
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={isBusy}
                        onClick={() => startReschedule(appointment)}
                      >
                        Reprogramar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={isBusy}
                        onClick={() => runAction(appointment.id, () => onCancel(appointment.id))}
                      >
                        Cancelar
                      </button>
                    </div>
                  )
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
