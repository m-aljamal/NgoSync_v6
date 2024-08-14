"use client"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function InputGroup({
  children,
}: {
  children: React.ReactNode
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  return (
    <div
      className={cn(
        `col-span-2 grid grid-cols-2 gap-x-2 gap-y-4`,
        isDesktop ? "grid-cols-2" : "grid-cols-1 px-5"
      )}
    >
      {children}
    </div>
  )
}
