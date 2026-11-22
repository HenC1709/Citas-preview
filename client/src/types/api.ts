export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

export interface CreateServiceItemRequest {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export interface Appointment {
  id: string;
  serviceItemId: string;
  customerName: string;
  customerEmail: string;
  scheduledAt: string;
  endsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  serviceItemId: string;
  customerName: string;
  customerEmail: string;
  scheduledAt: string;
  notes?: string | null;
}

export interface RescheduleAppointmentRequest {
  newScheduledAt: string;
}

export interface ProblemDetails {
  title?: string;
  status?: number;
  detail?: string;
}
