import { Component, computed, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonButton,
} from '@ionic/angular';
import { EstadoCita } from '../models/appointment.model';
import { AppointmentService, etiquetaEstado } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';
import { NativeFeedbackService } from '../services/native-feedback.service';

type FiltroCitas = 'activas' | 'historial';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonChip,
    IonButton,
  ],
})
export class Tab2Page {
  private readonly agenda = inject(AppointmentService);
  private readonly auth = inject(AuthService);
  private readonly native = inject(NativeFeedbackService);

  readonly filtro = signal<FiltroCitas>('activas');

  readonly esEspecialista = computed(
    () => this.auth.currentUser()?.profileType === 'especialista'
  );

  readonly citasVisibles = computed(() => {
    this.agenda.citasAgendadas();
    const user = this.auth.currentUser();
    const todas = this.esEspecialista()
      ? this.agenda.todasLasCitas()
      : this.agenda.citasDeCliente(user?.email ?? '');

    const activas = new Set<EstadoCita>(['Confirmado', 'En Atención']);
    return todas.filter((c) =>
      this.filtro() === 'activas' ? activas.has(c.estado) : !activas.has(c.estado)
    );
  });

  cambiarFiltro(event: CustomEvent): void {
    this.filtro.set(event.detail.value as FiltroCitas);
  }

  nombreServicio(id: string): string {
    return this.agenda.obtenerServicio(id)?.nombre ?? 'Servicio';
  }

  nombreEstacion(id: string): string {
    const est = this.agenda.obtenerEstacion(id);
    return est ? `${est.nombre} · ${est.profesional}` : 'Estación';
  }

  colorEstado(estado: EstadoCita): string {
    return etiquetaEstado(estado);
  }

  async cancelar(id: string): Promise<void> {
    this.agenda.cancelarCita(id);
    await this.native.toast('La cita fue cancelada');
  }

  async cambiarEstado(id: string, estado: EstadoCita): Promise<void> {
    this.agenda.actualizarEstado(id, estado);
    await this.native.toast(`Estado actualizado: ${estado}`);
  }
}
