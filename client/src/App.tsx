import { useCallback, useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { AppointmentForm } from './components/AppointmentForm';
import { AppointmentList } from './components/AppointmentList';
import { BusinessInfo } from './components/BusinessInfo';
import { Navbar, type NavTab } from './components/Navbar';
import { OwnerLogin } from './components/OwnerLogin';
import { ServiceSection } from './components/ServiceSection';
import type {
  Appointment,
  CreateAppointmentRequest,
  CreateServiceItemRequest,
  ServiceItem,
} from './types/api';

const OWNER_SESSION_KEY = 'reservacion_owner_auth';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('booking');
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(
    () => sessionStorage.getItem(OWNER_SESSION_KEY) === 'true',
  );

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoadingServices(true);
    setError(null);

    try {
      const servicesData = await apiClient.getServices();
      setServices(servicesData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo conectar con la API. Verifica que Reservacion.Api esté corriendo.',
      );
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    setError(null);

    try {
      const appointmentsData = await apiClient.getAppointments();
      setAppointments(appointmentsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las citas desde la API.',
      );
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (isOwnerAuthenticated) {
      void loadAppointments();
    }
  }, [isOwnerAuthenticated, loadAppointments]);

  function handleTabChange(tab: NavTab) {
    setActiveTab(tab);
    setError(null);
    setFeedback(null);
  }

  function handleOwnerLogin() {
    sessionStorage.setItem(OWNER_SESSION_KEY, 'true');
    setIsOwnerAuthenticated(true);
    setError(null);
    setFeedback('Sesión iniciada como dueño del local.');
  }

  function handleOwnerLogout() {
    sessionStorage.removeItem(OWNER_SESSION_KEY);
    setIsOwnerAuthenticated(false);
    setAppointments([]);
    setActiveTab('booking');
    setFeedback('Sesión cerrada.');
  }

  async function handleAction(action: () => Promise<void>, successMessage: string) {
    setError(null);
    setFeedback(null);

    try {
      await action();
      setFeedback(successMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
      throw err;
    }
  }

  async function handleCreateService(payload: CreateServiceItemRequest) {
    await handleAction(async () => {
      const created = await apiClient.createService(payload);
      setServices((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    }, 'Servicio creado correctamente.');
  }

  async function handleCreateAppointment(payload: CreateAppointmentRequest) {
    await handleAction(async () => {
      const created = await apiClient.createAppointment(payload);
      if (isOwnerAuthenticated) {
        setAppointments((prev) =>
          [...prev, created].sort(
            (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
          ),
        );
      }
    }, 'Cita reservada correctamente. El dueño podrá confirmarla desde su panel.');
  }

  async function handleConfirm(id: string) {
    await handleAction(async () => {
      const updated = await apiClient.confirmAppointment(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    }, 'Cita confirmada.');
  }

  async function handleCancel(id: string) {
    await handleAction(async () => {
      const updated = await apiClient.cancelAppointment(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    }, 'Cita cancelada.');
  }

  async function handleReschedule(id: string, newScheduledAt: string) {
    await handleAction(async () => {
      const updated = await apiClient.rescheduleAppointment(id, { newScheduledAt });
      setAppointments((prev) =>
        prev
          .map((a) => (a.id === id ? updated : a))
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
      );
    }, 'Cita reprogramada.');
  }

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;

  return (
    <div className="app-shell">
      <Navbar
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        isOwnerAuthenticated={isOwnerAuthenticated}
        appointmentsCount={appointments.length}
        onLogout={handleOwnerLogout}
      />

      <div className="container">
        {error && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
            <button type="button" className="alert-close" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {feedback && (
          <div className="alert alert-success" role="status">
            <span>{feedback}</span>
            <button type="button" className="alert-close" onClick={() => setFeedback(null)}>
              ×
            </button>
          </div>
        )}

        {loadingServices ? (
          <p className="loading">Cargando servicios desde la API...</p>
        ) : (
          <main>
            {activeTab === 'booking' && (
              <div className="layout">
                <div className="column">
                  <AppointmentForm
                    services={services}
                    onCreateAppointment={handleCreateAppointment}
                  />
                </div>
                <div className="column">
                  <ServiceSection services={services} />
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <BusinessInfo
                services={services}
                onGoToBooking={() => handleTabChange('booking')}
              />
            )}

            {activeTab === 'appointments' && (
              !isOwnerAuthenticated ? (
                <OwnerLogin onLoginSuccess={handleOwnerLogin} />
              ) : (
                <div className="owner-panel">
                  <div className="owner-toolbar">
                    <div className="stats-row">
                      <div className="stat-card">
                        <span className="muted">Total de citas</span>
                        <strong>{appointments.length}</strong>
                      </div>
                      <div className="stat-card">
                        <span className="muted">Pendientes</span>
                        <strong>{pendingCount}</strong>
                      </div>
                      <div className="stat-card">
                        <span className="muted">Confirmadas</span>
                        <strong>{confirmedCount}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => void loadAppointments()}
                      disabled={loadingAppointments}
                    >
                      {loadingAppointments ? 'Actualizando...' : 'Actualizar agenda'}
                    </button>
                  </div>

                  <div className="layout">
                    <div className="column">
                      <ServiceSection
                        services={services}
                        canManage
                        onCreateService={handleCreateService}
                      />
                    </div>
                    <div className="column">
                      {loadingAppointments ? (
                        <p className="loading">Cargando citas...</p>
                      ) : (
                        <AppointmentList
                          appointments={appointments}
                          services={services}
                          onConfirm={handleConfirm}
                          onCancel={handleCancel}
                          onReschedule={handleReschedule}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </main>
        )}
      </div>
    </div>
  );
}
