"use client"

import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { ScrollArea } from "../ui/scroll-area"

interface UpdateSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  children: React.ReactNode
}

export function UpdateSheet({ children, ...props }: UpdateSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent
        className="flex h-[calc(100vh-2rem)] flex-col gap-6 px-8"
        side="bottom"
      >
        <SheetHeader>
          <SheetTitle>تعديل</SheetTitle>
          <SheetDescription>عدل المعلومات واحفظ التغييرات</SheetDescription>
        </SheetHeader>
        <ScrollArea className="pl-4">{children}</ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
