export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;          // ISO string — fecha de creación
  prioridad: 'alta' | 'media' | 'baja';
  fechaVencimiento: string; // ISO string
  completada: boolean;
  updatedAt: string;       // ISO string — fecha de última actualización
}

export interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  emailAlerts: boolean;
  browserNotifications: boolean;
  darkMode: boolean;
}

export type ScreenType = 'tasks' | 'settings';
