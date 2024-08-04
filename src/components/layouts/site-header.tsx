import Link from "next/link"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/layouts/mode-toggle"

import MobileNavigation from "./MobileNavigation"
import Navigation from "./navigation"

export function SiteHeader() {
  return (
    <header className="px-4 py-8 lg:px-14 pb-36 bg-blue-800">

    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  ">
      <div className="container flex h-14 items-center">
        <Link href="/" className="ml-4 flex items-center">
          <h2 className="text-lg font-bold">NgoSync</h2>
        </Link>

        <Navigation />
        <MobileNavigation />
        <nav className="flex flex-1 items-center gap-1 md:justify-end">
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link
              aria-label="GitHub repo"
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubLogoIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </div>
    </header>
  )
}
