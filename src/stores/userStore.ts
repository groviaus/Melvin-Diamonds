import { create } from "zustand";

interface UserState {
  name: string | null;
  image: string | null;
  setUser: (user: { name: string | null; image: string | null }) => void;
  updateUser: (data: { name?: string | null; image?: string | null }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: null,
  image: null,
  setUser: (user) => set({ name: user.name, image: user.image }),
  updateUser: (data) =>
    set((state) => ({
      name: data.name !== undefined ? data.name : state.name,
      image: data.image !== undefined ? data.image : state.image,
    })),
}));
