import { create } from "zustand"

type UpdateDialogState = {
  id?: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useUpdateDataDialog = create<UpdateDialogState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
