import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonDatetime,
  IonButton,
} from '@ionic/angular';
import { AppointmentService, formatearPrecio } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { NativeFeedbackService } from '../../services/native-feedback.service';
import { Estacion, Servicio } from '../../models/appointment.model';

@Component({
  selector: 'app-select-slot',
  templateUrl: './select-slot.page.html',
  styleUrls: ['./select-slot.page.scss'],
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonDatetime,
    IonButton,
  ],
})
export class SelectSlotPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly agenda = inject(AppointmentService);
  private readonly auth = inject(AuthService);
  private readonly native = inject(NativeFeedbackService);

  readonly minDate = new Date().toISOString();
  readonly maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString();

  readonly servicio = signal<Servicio | undefined>(undefined);
  readonly estacion = signal<Estacion | undefined>(undefined);
  readonly fecha = signal(new Date().toISOString().slice(0, 10));
  readonly horaSeleccionada = signal<string | null>(null);

  readonly bloques = computed(() => {
    const estacion = this.estacion();
    if (!estacion) {
      return [];
    }
    return this.agenda.bloquesDelDia(
      estacion.id,
      this.fecha(),
      this.auth.currentUser()?.email
    );
  });

  constructor() {
    const servicioId = this.route.snapshot.queryParamMap.get('servicioId') ?? '';
    const estacionId = this.route.snapshot.queryParamMap.get('estacionId') ?? '';
    this.servicio.set(this.agenda.obtenerServicio(servicioId));
    this.estacion.set(this.agenda.obtenerEstacion(estacionId));
  }

  precio(valor: number): string {
    return formatearPrecio(valor);
  }

  cambiarFecha(event: CustomEvent): void {
    const value = String(event.detail.value ?? '').slice(0, 10);
    if (value) {
      this.fecha.set(value);
      this.horaSeleccionada.set(null);
    }
  }

  async seleccionarHora(hora: string): Promise<void> {
    this.horaSeleccionada.set(hora);
    await this.native.hapticLight();
  }

  async confirmar(): Promise<void> {
    const user = this.auth.currentUser();
    const servicio = this.servicio();
    const estacion = this.estacion();
    const hora = this.horaSeleccionada();

    if (!user || !servicio || !estacion || !hora) {
      return;
    }

    this.agenda.agendarCita({
      clienteEmail: user.email,
      servicioId: servicio.id,
      estacionId: estacion.id,
      fecha: this.fecha(),
      horaInicio: hora,
    });

    await this.native.hapticConfirm();
    await this.native.toast(`Cita confirmada: ${servicio.nombre} a las ${hora}`);
    await this.router.navigateByUrl('/tabs/tab2');
  }
}
