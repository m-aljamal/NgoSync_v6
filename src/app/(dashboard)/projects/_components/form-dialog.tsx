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

export default function FormDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, onOpen, onClose } = useFormDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")

  if (isDesktop)
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <PlusIcon className="ml-2 size-4" aria-hidden="true" />
            إضافة
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مشروع</DialogTitle>
            <DialogDescription>
              قم بملء التفاصيل أدناه لإنشاء مشروع جديد.
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}
    >
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="ml-2 size-4" aria-hidden="true" />
          اضافة
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>إضافة مشروع</DrawerTitle>
          <DrawerDescription>
            قم بملء التفاصيل أدناه لإنشاء مشروع جديد.
          </DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
