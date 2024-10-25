import { ModeToggle } from "@/components/layouts/mode-toggle"

import Logo from "./Logo"
import Navigation from "./navigation"
import { UserNav } from "./UserNav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-10">
        <div className="flex h-14 flex-row-reverse items-center lg:flex-row">
          <Logo />
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
