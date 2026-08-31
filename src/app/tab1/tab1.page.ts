import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
  IonItem,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cutOutline, flowerOutline } from 'ionicons/icons';
import { CategoriaServicio, Estacion, Servicio } from '../models/appointment.model';
import { AppointmentService, formatearPrecio } from '../services/appointment.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
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
    IonItem,
    IonIcon,
  ],
})
export class Tab1Page {
  private readonly agenda = inject(AppointmentService);
  private readonly router = inject(Router);

  readonly categoria = signal<CategoriaServicio>('barberia');
  readonly servicioSeleccionado = signal<Servicio | null>(null);

  readonly serviciosFiltrados = computed(() =>
    this.agenda.serviciosPorCategoria(this.categoria())
  );

  readonly estacionesFiltradas = computed(() => {
    const tipo = this.categoria() === 'barberia' ? 'sillon-barberia' : 'mesa-manicura';
    return this.agenda.estacionesPorTipo(tipo);
  });

  constructor() {
    addIcons({ cutOutline, flowerOutline });
  }

  precio(valor: number): string {
    return formatearPrecio(valor);
  }

  cambiarCategoria(event: CustomEvent): void {
    const value = event.detail.value as CategoriaServicio;
    this.categoria.set(value);
    this.servicioSeleccionado.set(null);
  }

  seleccionarServicio(servicio: Servicio): void {
    this.servicioSeleccionado.set(servicio);
  }

  irAHorario(estacion: Estacion): void {
    const servicio = this.servicioSeleccionado();
    if (!servicio) {
      return;
    }
    this.router.navigate(['/select-slot'], {
      queryParams: { servicioId: servicio.id, estacionId: estacion.id },
    });
  }
}
