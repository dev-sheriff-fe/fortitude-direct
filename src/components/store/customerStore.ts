import { LoggedInUser, UserProfile } from '@/types/index';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


// ✅ Define the correct store shape
interface UserStore {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clear: () => void;
}

// ✅ Zustand store with correct type
const useCustomer = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      clear: () => set(() => ({ user: null })),
    }),
    {
      name: 'customer_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCustomer;
