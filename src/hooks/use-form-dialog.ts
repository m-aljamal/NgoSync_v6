// import { useState } from "react"

// export const useFormDialog = () => {
//   const [isOpen, setIsOpen] = useState(false)

//   const onOpen = () => setIsOpen(true)
//   const onClose = () => setIsOpen(false)
//   const toggle = () => setIsOpen(!isOpen)

//   return { isOpen, onOpen, onClose, toggle }
// }


import { create } from "zustand"

type FormDialogState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  toggle: () => void
}

export const useFormDialog = create<FormDialogState>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
}))