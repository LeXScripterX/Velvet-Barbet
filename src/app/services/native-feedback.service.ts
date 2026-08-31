import { Injectable } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';

@Injectable({ providedIn: 'root' })
export class NativeFeedbackService {
  async hapticLight(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      /* Web / emulador sin haptic */
    }
  }

  async hapticConfirm(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      /* Web / emulador sin haptic */
    }
  }

  async toast(text: string): Promise<void> {
    try {
      await Toast.show({ text, duration: 'short', position: 'bottom' });
    } catch {
      /* Si el plugin no está disponible, no bloqueamos el flujo */
    }
  }
}
