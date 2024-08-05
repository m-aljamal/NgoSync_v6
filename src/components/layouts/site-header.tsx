import Link from "next/link"
import { ModeToggle } from "@/components/layouts/mode-toggle"
import Navigation from "./navigation"
import { UserNav } from "./UserNav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-2xl">
        <div className="container flex h-14 flex-row-reverse items-center lg:flex-row">
          <Link href="/" className="ml-4 hidden items-center lg:flex">
            <h2 className="text-lg font-bold">NgoSync</h2>
          </Link>

          <Navigation />
          <div className="flex flex-1 gap-3">
            <UserNav image="" name="MO" />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
