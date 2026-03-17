import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { statisticsReducer } from './features/admin/store/statistics.reducer';
import { StatisticsEffects } from './features/admin/store/statistics.effects';
import { ingredientReducer } from './features/admin/store/ingredient.reducer';
import { IngredientEffects } from './features/admin/store/ingredient.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer, statistics: statisticsReducer, ingredient: ingredientReducer }),
    provideEffects([AuthEffects, StatisticsEffects, IngredientEffects])
  ]
};
