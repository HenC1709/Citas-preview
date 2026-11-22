import type {
  Appointment,
  CreateAppointmentRequest,
  CreateServiceItemRequest,
  ProblemDetails,
  RescheduleAppointmentRequest,
  ServiceItem,
} from '../types/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;

    try {
      const problem = (await response.json()) as ProblemDetails;
      message = problem.detail || problem.title || message;
    } catch {
      // Si la respuesta no es JSON válido, conservamos el mensaje por defecto.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  getServices: () => request<ServiceItem[]>('/api/services'),

  createService: (payload: CreateServiceItemRequest) =>
    request<ServiceItem>('/api/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAppointments: () => request<Appointment[]>('/api/appointments'),

  createAppointment: (payload: CreateAppointmentRequest) =>
    request<Appointment>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  confirmAppointment: (id: string) =>
    request<Appointment>(`/api/appointments/${id}/confirm`, {
      method: 'PATCH',
    }),

  cancelAppointment: (id: string) =>
    request<Appointment>(`/api/appointments/${id}/cancel`, {
      method: 'PATCH',
    }),

  rescheduleAppointment: (id: string, payload: RescheduleAppointmentRequest) =>
    request<Appointment>(`/api/appointments/${id}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
