import { create } from "zustand"

export type TableType = "donation" | "doner"

type ViewMoreDialogState = {
  id: string | null
  isOpen: boolean
  onOpen: (id: string, table: TableType) => void
  onClose: () => void
  table: TableType | null
}

export const useViewMoreDialog = create<ViewMoreDialogState>((set) => ({
  id: null,
  table: null,
  isOpen: false,
  onOpen: (id: string, table: TableType) => set({ isOpen: true, id, table }),
  onClose: () => set({ isOpen: false, id: null, table: null }),
}))
