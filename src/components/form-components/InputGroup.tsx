"use client"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function InputGroup({
  children,
  isUpdate,
  cols = "grid-cols-2",
}: {
  children: React.ReactNode
  isUpdate?: boolean
  cols?: "grid-cols-2" | "grid-cols-3"
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  return (
    <div
      className={cn(
        `col-span-2 grid grid-cols-2 gap-x-3 gap-y-4`,
        isDesktop ? cols : "grid-cols-2 px-5",
        isUpdate && "grid-cols-2"
      )}
    >
      {children}
    </div>
  )
}
