import { create } from 'zustand'

type MenuState = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}))

