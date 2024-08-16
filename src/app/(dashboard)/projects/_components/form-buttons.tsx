"use client"

import { ReloadIcon } from "@radix-ui/react-icons"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer"

export default function FormButtons({ isExecuting }: { isExecuting: boolean }) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  if (isDesktop)
    return (
      <DialogFooter className="gap-2 pt-2">
        <Button disabled={isExecuting}>
          {isExecuting && (
            <ReloadIcon
              className="ml-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          إنشاء
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            إلغاء
          </Button>
        </DialogClose>
      </DialogFooter>
    )
  return (
    <DrawerFooter className="gap-2 sm:gap-0">
      <DrawerClose asChild>
        <Button variant="outline"> إلغاء</Button>
      </DrawerClose>
      <Button disabled={isExecuting}>
        {isExecuting && (
          <ReloadIcon className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        إنشاء
      </Button>
    </DrawerFooter>
  )
}
