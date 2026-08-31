import { Injectable, computed, signal } from '@angular/core';
import {
  BloqueHorario,
  Cita,
  Estacion,
  EstadoCita,
  Servicio,
} from '../models/appointment.model';

const HORAS_BASE = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly servicios = signal<Servicio[]>([
    {
      id: 'srv-corte',
      nombre: 'Corte de precisión',
      categoria: 'barberia',
      duracionMinutos: 45,
      precio: 45000,
      descripcion: 'Corte de autor con perfilado de contornos.',
    },
    {
      id: 'srv-barba',
      nombre: 'Perfilado de barba',
      categoria: 'barberia',
      duracionMinutos: 30,
      precio: 30000,
      descripcion: 'Definición de barba y toalla caliente.',
    },
    {
      id: 'srv-facial',
      nombre: 'Tratamiento facial',
      categoria: 'barberia',
      duracionMinutos: 40,
      precio: 55000,
      descripcion: 'Limpieza y ritual facial post-afeitado.',
    },
    {
      id: 'srv-manicura-rusa',
      nombre: 'Manicura rusa',
      categoria: 'unas',
      duracionMinutos: 60,
      precio: 60000,
      descripcion: 'Técnica de precisión con cutícula limpia.',
    },
    {
      id: 'srv-pedicura-spa',
      nombre: 'Pedicura spa',
      categoria: 'unas',
      duracionMinutos: 50,
      precio: 65000,
      descripcion: 'Exfoliación, hidratación y esmaltado.',
    },
    {
      id: 'srv-esmaltado',
      nombre: 'Esmaltado permanente',
      categoria: 'unas',
      duracionMinutos: 35,
      precio: 40000,
      descripcion: 'Color de larga duración con brillo espejo.',
    },
  ]);

  private readonly estaciones = signal<Estacion[]>([
    { id: 'est-sillon-1', nombre: 'Sillón 1', tipo: 'sillon-barberia', profesional: 'Andrés Molina' },
    { id: 'est-sillon-2', nombre: 'Sillón 2', tipo: 'sillon-barberia', profesional: 'Camila Restrepo' },
    { id: 'est-mesa-1', nombre: 'Mesa 1', tipo: 'mesa-manicura', profesional: 'Valentina Cruz' },
    { id: 'est-mesa-2', nombre: 'Mesa 2', tipo: 'mesa-manicura', profesional: 'Laura Gómez' },
  ]);

  private readonly citas = signal<Cita[]>([
    {
      id: 'cita-demo-1',
      clienteEmail: 'demo@velvetblade.com',
      servicioId: 'srv-corte',
      estacionId: 'est-sillon-1',
      fecha: isoDate(1),
      horaInicio: '10:00',
      estado: 'Confirmado',
    },
    {
      id: 'cita-demo-2',
      clienteEmail: 'demo@velvetblade.com',
      servicioId: 'srv-manicura-rusa',
      estacionId: 'est-mesa-1',
      fecha: isoDate(-5),
      horaInicio: '14:00',
      estado: 'Completado',
    },
    {
      id: 'cita-ocupada',
      clienteEmail: 'otro@velvetblade.com',
      servicioId: 'srv-barba',
      estacionId: 'est-sillon-1',
      fecha: isoDate(1),
      horaInicio: '11:00',
      estado: 'Confirmado',
    },
  ]);

  readonly serviciosDisponibles = computed(() => this.servicios());
  readonly estacionesDisponibles = computed(() => this.estaciones());
  readonly citasAgendadas = computed(() => this.citas());

  serviciosPorCategoria(categoria: Servicio['categoria']): Servicio[] {
    return this.servicios().filter((s) => s.categoria === categoria);
  }

  estacionesPorTipo(tipo: Estacion['tipo']): Estacion[] {
    return this.estaciones().filter((e) => e.tipo === tipo);
  }

  obtenerServicio(id: string): Servicio | undefined {
    return this.servicios().find((s) => s.id === id);
  }

  obtenerEstacion(id: string): Estacion | undefined {
    return this.estaciones().find((e) => e.id === id);
  }

  citasDeCliente(clienteEmail: string): Cita[] {
    return this.citas()
      .filter((c) => c.clienteEmail.toLowerCase() === clienteEmail.toLowerCase())
      .sort((a, b) => `${b.fecha}${b.horaInicio}`.localeCompare(`${a.fecha}${a.horaInicio}`));
  }

  todasLasCitas(): Cita[] {
    return [...this.citas()].sort((a, b) =>
      `${b.fecha}${b.horaInicio}`.localeCompare(`${a.fecha}${a.horaInicio}`)
    );
  }

  bloquesDelDia(estacionId: string, fecha: string, clienteEmail?: string): BloqueHorario[] {
    const delDia = this.citas().filter(
      (c) => c.estacionId === estacionId && c.fecha === fecha && c.estado !== 'Cancelado'
    );

    return HORAS_BASE.map((hora) => {
      const cita = delDia.find((c) => c.horaInicio === hora);
      if (!cita) {
        return { hora, estado: 'disponible' as const };
      }
      const esPropia =
        !!clienteEmail && cita.clienteEmail.toLowerCase() === clienteEmail.toLowerCase();
      return { hora, estado: esPropia ? ('reservado' as const) : ('ocupado' as const) };
    });
  }

  agendarCita(cita: Omit<Cita, 'id' | 'estado'>): Cita {
    const nueva: Cita = {
      ...cita,
      id: crypto.randomUUID(),
      estado: 'Confirmado',
    };
    this.citas.update((actuales) => [...actuales, nueva]);
    return nueva;
  }

  actualizarEstado(citaId: string, estado: EstadoCita): void {
    this.citas.update((actuales) =>
      actuales.map((c) => (c.id === citaId ? { ...c, estado } : c))
    );
  }

  cancelarCita(citaId: string): void {
    this.actualizarEstado(citaId, 'Cancelado');
  }
}

export function formatearPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export function etiquetaEstado(estado: EstadoCita): 'success' | 'warning' | 'primary' | 'medium' {
  switch (estado) {
    case 'Completado':
      return 'success';
    case 'En Atención':
      return 'warning';
    case 'Confirmado':
      return 'primary';
    default:
      return 'medium';
  }
}
