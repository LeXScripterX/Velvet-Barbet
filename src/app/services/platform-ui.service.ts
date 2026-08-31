import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformUiService {
  readonly isIos = document.documentElement.classList.contains('ios');
  readonly inputFill: 'outline' | undefined = this.isIos ? undefined : 'outline';
}
