import { ModeToggle } from "@/components/layouts/mode-toggle"
import { filterPageLinksByRole } from "@/app/_lib/auth"

import Logo from "./Logo"
import Navigation from "./navigation"
import { routes } from "./routes"
import { UserNav } from "./UserNav"

export async function SiteHeader() {
  const filterdRouteByRoll = await filterPageLinksByRole(routes)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-10">
        <div className="flex h-14 flex-row-reverse items-center lg:flex-row">
          <Logo />
          <Navigation routes={filterdRouteByRoll} />
          <div className="flex flex-1 gap-3">
            <UserNav image="" name="MO" />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
