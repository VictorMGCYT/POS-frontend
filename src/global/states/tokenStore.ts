import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TokenState {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: "" }),
    }),
    {
      name: 'token-pos',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);