"use client"

import * as React from "react"
import { PlusIcon } from "@radix-ui/react-icons"

import { useFormDialog } from "@/hooks/use-form-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { ScrollArea } from "../ui/scroll-area"

export default function FormDialog({
  children,
  title = "إضافة جديد",
  description = "قم بملء التفاصيل أدناه لإنشاء عنصر جديد.",
  triggerButton,
  // isOpen,
  // onOpenChange,
}: {
  children: React.ReactNode
  title?: string
  description?: string
  triggerButton?: React.ReactNode
  // isOpen: boolean
  // onOpenChange: (isOpen: boolean) => void
}) {
  const { isOpen, onOpen, onClose } = useFormDialog()

  const isDesktop = useMediaQuery("(min-width: 640px)")

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <PlusIcon className="ml-2 size-4" aria-hidden="true" />
      إضافة
    </Button>
  )

  if (isDesktop)
    return (
      <Dialog
        open={isOpen}
        // onOpenChange={onOpenChange}
        onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}
      >
        <DialogTrigger asChild>{triggerButton || defaultTrigger}</DialogTrigger>
        <DialogContent>
          <ScrollArea className="max-h-[80vh] p-2">
            <DialogHeader className="mb-5">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <main className="px-5">{children}</main>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer
      open={isOpen}
      // onOpenChange={onOpenChange}
      onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}
    >
      <DrawerTrigger asChild>{triggerButton || defaultTrigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">{children}</ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
