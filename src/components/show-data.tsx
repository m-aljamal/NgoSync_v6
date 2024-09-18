import React from "react"

import { useViewDataDialog } from "@/hooks/use-view-data-dialog"

import { Button } from "./ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

export default function ShowData() {
  const { isOpen, onClose, id, onOpen } = useViewDataDialog()

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(isOpen) => (isOpen ? onOpen("") : onClose())}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>title</DrawerTitle>
          <DrawerDescription> description </DrawerDescription>
        </DrawerHeader>
        <div className="h-72 ">this is </div>
      </DrawerContent>
    </Drawer>
  )
}
