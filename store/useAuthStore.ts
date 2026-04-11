import { create } from 'zustand';

interface AuthState {
  user: string | null;
  token: string | null;
  isLoggedIn: boolean;
  // Acciones (Funciones para cambiar el estado)
  login: (name: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  login: (user, token) =>
    set({
      user,
      token,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    }),
}));
