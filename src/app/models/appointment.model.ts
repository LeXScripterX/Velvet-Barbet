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
  descripcion: string;
}

export type TipoEstacion = 'sillon-barberia' | 'mesa-manicura';

export interface Estacion {
  id: string;
  nombre: string;
  tipo: TipoEstacion;
  profesional: string;
}

export type EstadoCita = 'Confirmado' | 'En Atención' | 'Completado' | 'Cancelado';

export type EstadoBloque = 'disponible' | 'ocupado' | 'reservado';

export interface BloqueHorario {
  hora: string;
  estado: EstadoBloque;
}

export interface Cita {
  id: string;
  clienteEmail: string;
  servicioId: string;
  estacionId: string;
  fecha: string;
  horaInicio: string;
  estado: EstadoCita;
}
