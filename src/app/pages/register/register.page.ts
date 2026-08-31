import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonCheckbox,
  IonBackButton,
  IonButtons,
  IonItem,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, callOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { PlatformUiService } from '../../services/platform-ui.service';
import { ProfileType } from '../../models/appointment.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonCheckbox,
    IonBackButton,
    IonButtons,
    IonItem,
  ],
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly ui = inject(PlatformUiService);

  readonly registerError = signal<string | null>(null);

  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profileType: ['cliente' as ProfileType, [Validators.required]],
    acceptedTerms: [false, [Validators.requiredTrue]],
  });

  constructor() {
    addIcons({ personOutline, callOutline, mailOutline, lockClosedOutline });
  }

  get fullName() {
    return this.form.controls.fullName;
  }
  get phone() {
    return this.form.controls.phone;
  }
  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get acceptedTerms() {
    return this.form.controls.acceptedTerms;
  }

  onSubmit(): void {
    this.registerError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, phone, email, password, profileType } = this.form.getRawValue();

    const result = this.auth.register({
      fullName: fullName!,
      phone: phone!,
      email: email!,
      password: password!,
      profileType: profileType as ProfileType,
    });

    if (!result.ok) {
      this.registerError.set(result.message);
      return;
    }

    this.router.navigateByUrl('/tabs/tab1');
  }
}
