import React from "react"

import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer"
import { ScrollArea } from "./ui/scroll-area"

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
      <DrawerContent className="h-[calc(100%-1rem)] px-5 pb-8">
        <DrawerHeader>
          <DrawerTitle>التفاصيل</DrawerTitle>
          <DrawerDescription>تفاصيل الحركة</DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="overflow-y-auto" dir="rtl">
          {children}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
