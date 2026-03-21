import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../../models/auth.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectUserId = createSelector(
  selectUser,
  (user) => user?.id
);

export const selectUsername = createSelector(
  selectUser,
  (user) => user?.username
);

export const selectEmail = createSelector(
  selectUser,
  (user) => user?.email
);

export const selectFullName = createSelector(
  selectUser,
  (user) => user?.fullName
);

export const selectRole = createSelector(
  selectUser,
  (user) => user?.role ?? null
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
