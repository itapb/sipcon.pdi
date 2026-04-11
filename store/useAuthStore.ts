import type { DataUser } from '@/utils/fetchs/login/POST_Login';
import { create } from 'zustand';

interface AuthState {
  user: DataUser | null;
  area: number | null;
  isLoggedIn: boolean;
  // Acciones (Funciones para cambiar el estado)
  login: (user: DataUser, area: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  area: null,
  isLoggedIn: false,

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
