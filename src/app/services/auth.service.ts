import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/appointment.model';

/**
 * Servicio de autenticación mock para el avance del semestre.
 * Los usuarios viven en memoria (no hay backend todavía); se reinician
 * al recargar la app. La interfaz pública (login/register/logout) es
 * la que se debe respetar cuando se conecte un backend real más adelante.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  /** Usuario "semilla" para poder probar el login sin registrarse primero */
  private usuarios: Usuario[] = [
    {
      fullName: 'Cliente Demo',
      phone: '3000000000',
      email: 'demo@velvetblade.com',
      password: '123456',
      profileType: 'cliente',
    },
  ];

  /** Usuario autenticado actualmente (null si no hay sesión) */
  readonly currentUser = signal<Usuario | null>(null);

  login(email: string, password: string): { ok: true; user: Usuario } | { ok: false; message: string } {
    const found = this.usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { ok: false, message: 'Correo o contraseña incorrectos.' };
    }

    this.currentUser.set(found);
    return { ok: true, user: found };
  }

  register(usuario: Usuario): { ok: true } | { ok: false; message: string } {
    const exists = this.usuarios.some((u) => u.email.toLowerCase() === usuario.email.toLowerCase());

    if (exists) {
      return { ok: false, message: 'Ya existe una cuenta registrada con ese correo.' };
    }

    this.usuarios.push(usuario);
    this.currentUser.set(usuario);
    return { ok: true };
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
