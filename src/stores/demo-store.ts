import { create } from 'zustand';

type DemoState = {
  selectedUserId: string | null;
  isModalOpen: boolean;
  isConfirmOpen: boolean;
  setSelectedUserId: (id: string | null) => void;
  setModalOpen: (open: boolean) => void;
  setConfirmOpen: (open: boolean) => void;
};

export const useDemoStore = create<DemoState>((set) => ({
  selectedUserId: null,
  isModalOpen: false,
  isConfirmOpen: false,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  setModalOpen: (open) => set({ isModalOpen: open }),
  setConfirmOpen: (open) => set({ isConfirmOpen: open }),
}));
