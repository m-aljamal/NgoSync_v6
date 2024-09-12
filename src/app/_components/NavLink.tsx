"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { icons } from "@/components/layouts/icons"

export function NavLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: {
    href: string
    icon?: keyof typeof icons
  }
}) {
  const pathname = usePathname()
  const Component = icons[link.icon || "ArrowDownLeft"]
  return (
    <Link
      href={link.href}
      className={cn(
        "flex w-full items-center justify-start gap-2 rounded-md py-2 text-sm hover:bg-accent hover:text-accent-foreground",
        pathname === link.href && "bg-accent text-accent-foreground"
      )}
    >
      <Component className="mr-2 size-5" />
      <span>{children}</span>
    </Link>
  )
}
