// Modelos centrales del dominio Velvet & Blade: Usuario, Servicio, Estación y Cita.

export type ProfileType = 'cliente' | 'especialista';

export interface Usuario {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  profileType: ProfileType;
}

export type CategoriaServicio = 'barberia' | 'unas';

export interface Servicio {
  id: string;
  nombre: string;
  categoria: CategoriaServicio;
  duracionMinutos: number;
  precio: number;
}

export type TipoEstacion = 'sillon-barberia' | 'mesa-manicura';

export interface Estacion {
  id: string;
  nombre: string;
  tipo: TipoEstacion;
}

export type EstadoCita = 'Confirmado' | 'En Atención' | 'Completado' | 'Cancelado';

export interface Cita {
  id: string;
  clienteEmail: string;
  servicioId: string;
  estacionId: string;
  fecha: string; // ISO date, e.g. '2026-09-02'
  horaInicio: string; // '09:00'
  estado: EstadoCita;
}
