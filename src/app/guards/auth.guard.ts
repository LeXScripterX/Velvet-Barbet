import { inject, Inject } from "@angular/core";
import { CanActivate, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Es donde proteje el acceso a las tabs (Catálogo, Historial, Perfil): si no hay
 * sessión activa, rediriiiige a /login en lugar de dejar navegar.
 */

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.currentUser()) {
        return true;
    }

    return router.parseUrl('/login')
};