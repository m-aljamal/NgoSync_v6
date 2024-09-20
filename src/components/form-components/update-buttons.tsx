import React from "react"
import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "../ui/button"
import { SheetClose, SheetFooter } from "../ui/sheet"

export default function UpdateButtons({
  isExecuting,
}: {
  isExecuting: boolean
}) {
  return (
    <SheetFooter className="gap-2 pt-4">
      <Button disabled={isExecuting}>
        {isExecuting && (
          <ReloadIcon className="ml-2 size-4 animate-spin" aria-hidden="true" />
        )}
        تعديل
      </Button>
      <SheetClose asChild>
        <Button type="button" variant="outline">
          إلغاء
        </Button>
      </SheetClose>
    </SheetFooter>
  )
}
