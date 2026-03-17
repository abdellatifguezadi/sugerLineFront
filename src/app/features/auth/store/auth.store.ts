// import { Injectable, signal, computed } from '@angular/core';
// import { User } from '../../../models/auth.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthStore {
//   private state = signal<{ user: User | null; isAuthenticated: boolean }>({
//     user: typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
//     isAuthenticated: typeof localStorage !== 'undefined' ? !!localStorage.getItem('user') : false
//   });

//   user = computed(() => this.state().user);
//   isAuthenticated = computed(() => this.state().isAuthenticated);

//   setUser(user: User) {
//     if (typeof localStorage !== 'undefined') {
//       localStorage.setItem('user', JSON.stringify(user));
//     }
//     this.state.set({ user, isAuthenticated: true });
//   }

//   clearUser() {
//     if (typeof localStorage !== 'undefined') {
//       localStorage.removeItem('user');
//     }
//     this.state.set({ user: null, isAuthenticated: false });
//   }
// }
