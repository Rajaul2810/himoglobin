// authStore.js
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token: any) => set((state: any) => {
        if (state.token !== token) {
          return { token };
        }
        return state;
      }),

      setUser: (user: any) => set((state: any) => {
        if (state.user !== user) {
          return { user };
        }
        return state;
      }),
      logout: () => {
        console.log("Logging out and clearing storage...");
        set({ token: null, user: null });
        AsyncStorage.removeItem('auth-store'); // Clear persisted storage
      }, // Clear the auth state on logout
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useAuthStore;