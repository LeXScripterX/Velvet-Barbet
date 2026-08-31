import { Injectable, computed, signal } from '@angular/core';
import { Cita, Estacion, EstadoCita, Servicio } from '../models/appointment.model';

/**
 * Servicio de agenda: catálogo de servicios/estaciones y ciclo de vida de las citas.
 * Datos mock en memoria para este avance; misma lógica de negocio (filtros por
 * categoría, cambios de estado) que se reutilizará al conectar un backend real.
 */
@Injectable({ providedIn: 'root' })
export class AppointmentService {

  private readonly servicios = signal<Servicio[]>([
    { id: 'srv-corte', nombre: 'Corte de precisión', categoria: 'barberia', duracionMinutos: 45, precio: 45000 },
    { id: 'srv-barba', nombre: 'Perfilado de barba', categoria: 'barberia', duracionMinutos: 30, precio: 30000 },
    { id: 'srv-facial', nombre: 'Tratamiento facial', categoria: 'barberia', duracionMinutos: 40, precio: 55000 },
    { id: 'srv-manicura-rusa', nombre: 'Manicura rusa', categoria: 'unas', duracionMinutos: 60, precio: 60000 },
    { id: 'srv-pedicura-spa', nombre: 'Pedicura spa', categoria: 'unas', duracionMinutos: 50, precio: 65000 },
    { id: 'srv-esmaltado', nombre: 'Esmaltado permanente', categoria: 'unas', duracionMinutos: 35, precio: 40000 },
  ]);

  private readonly estaciones = signal<Estacion[]>([
    { id: 'est-sillon-1', nombre: 'Sillón 1', tipo: 'sillon-barberia' },
    { id: 'est-sillon-2', nombre: 'Sillón 2', tipo: 'sillon-barberia' },
    { id: 'est-mesa-1', nombre: 'Mesa 1', tipo: 'mesa-manicura' },
    { id: 'est-mesa-2', nombre: 'Mesa 2', tipo: 'mesa-manicura' },
  ]);

  private readonly citas = signal<Cita[]>([]);

  readonly serviciosDisponibles = computed(() => this.servicios());
  readonly estacionesDisponibles = computed(() => this.estaciones());
  readonly citasAgendadas = computed(() => this.citas());

  serviciosPorCategoria(categoria: Servicio['categoria']): Servicio[] {
    return this.servicios().filter((s) => s.categoria === categoria);
  }

  estacionesPorTipo(tipo: Estacion['tipo']): Estacion[] {
    return this.estaciones().filter((e) => e.tipo === tipo);
  }

  citasDeCliente(clienteEmail: string): Cita[] {
    return this.citas().filter((c) => c.clienteEmail.toLowerCase() === clienteEmail.toLowerCase());
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
}
