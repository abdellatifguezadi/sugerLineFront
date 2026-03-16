import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../../models/auth.model';
import * as AuthActions from './auth.actions';

function getStoredUser(): any {
  if (typeof localStorage !== 'undefined') {
    return JSON.parse(localStorage.getItem('user') || 'null');
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
  isAuthenticated: isUserStored()
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { response }) => {
    const user = { 
      id: response.id,
      username: response.username,
      email: response.email,
      fullName: response.fullName
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return {
      user,
      isAuthenticated: true
    };
  }),
  on(AuthActions.loadUserSuccess, (state, { user }) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return {
      user,
      isAuthenticated: true
    };
  }),
  on(AuthActions.logout, AuthActions.loadUserFailure, () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
    return {
      user: null,
      isAuthenticated: false
    };
  })
);
