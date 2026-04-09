import { create } from 'zustand';

interface AuthState {
  user: string | null;
  area: string | null;
  isLoggedIn: boolean;
  // Acciones (Funciones para cambiar el estado)
  login: (name: string, area: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: 'jose',
  area: 'jose',
  isLoggedIn: true,

  login: (user, area) =>
    set({
      user,
      area,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      user: null,
      area: null,
      isLoggedIn: false,
    }),
}));
