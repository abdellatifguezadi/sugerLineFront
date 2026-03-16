import { createReducer, on } from '@ngrx/store';
import { AuthState, User } from '../../../models/auth.model';
import * as AuthActions from './auth.actions';

function getStoredUser(): User | null {
  if (typeof localStorage !== 'undefined') {
    return JSON.parse(localStorage.getItem('user') || 'null') as User | null;
  }
  return null;
}

function isUserStored(): boolean {
  if (typeof localStorage !== 'undefined') {
    return !!localStorage.getItem('user');
  }
  return false;
}

export const initialState: AuthState = {
  user: getStoredUser(),
  isAuthenticated: isUserStored(),
  isLoading: isUserStored()
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loadUser, (state) => ({
    ...state,
    isLoading: true
  })),
  on(AuthActions.loginSuccess, (state, { response }) => {
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      fullName: response.fullName,
      role: response.role
    };

    const persistedUser: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(persistedUser));
    }

    return {
      user,
      isAuthenticated: true,
      isLoading: false
    };
  }),
  on(AuthActions.loadUserSuccess, (state, { user }) => {
    const persistedUser: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(persistedUser));
    }

    return {
      user,
      isAuthenticated: true,
      isLoading: false
    };
  }),
  on(AuthActions.logout, AuthActions.loadUserFailure, () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
  })
);
