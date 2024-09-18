"use client"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function InputGroup({
  children,
  cols = "grid-cols-2",
}: {
  children: React.ReactNode
  cols?: "grid-cols-2" | "grid-cols-3 | grid-cols-4 | grid-cols-full"
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  return (
    <div
      className={cn(
        `grid grid-cols-1 gap-x-5 space-y-5`,
        isDesktop ? cols : "mx-5"
      )}
    >
      {children}
    </div>
  )
}
