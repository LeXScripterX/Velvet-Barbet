import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, cutOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { PlatformUiService } from '../../services/platform-ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly ui = inject(PlatformUiService);

  readonly loginError = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, cutOutline });
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    this.loginError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const result = this.auth.login(email!, password!);

    if (!result.ok) {
      this.loginError.set(result.message);
      return;
    }

    this.router.navigateByUrl('/tabs/tab1');
  }
}
