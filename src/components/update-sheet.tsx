"use client"

import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface UpdateSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  children: React.ReactNode
}

export function UpdateSheet({ children, ...props }: UpdateSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 overflow-auto  " side="bottom">
        <SheetHeader className="text-right">
          <SheetTitle>تعديل</SheetTitle>
          <SheetDescription>عدل المعلومات واحفظ التغييرات</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
