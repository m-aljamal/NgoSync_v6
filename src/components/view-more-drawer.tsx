import React from "react"

import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer"

export default function ViewMoreDrawer({
  children,
}: {
  children?: React.ReactNode
}) {
  const { isOpen, onClose } = useViewMoreDialog()
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>التفاصيل</DrawerTitle>
          <DrawerDescription>تفاصيل الحركة</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
