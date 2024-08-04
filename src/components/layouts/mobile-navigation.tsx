"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { routes } from "./routes"

export default function MobileNavigation() {
  const [isOpen, setIsopen] = useState(false)
  const pathname = usePathname()

  const isActive = (route: (typeof routes)[0]) => {
    if (route.href && pathname === route.href) {
      return true
    }
    if (route.children) {
      return route.children.some((child) => pathname === child.href)
    }
    return false
  }
  const router = useRouter()

  const onClick = (href: string) => {
    router.push(href)
    setIsopen(false)
  }
  return (
    <Sheet open={isOpen} onOpenChange={setIsopen}>
      <SheetTrigger>
        <Button
          variant="outline"
          size="sm"
          className="border-none bg-white/10 font-normal outline-none transition hover:bg-white/20 focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pt-10">
        {routes.map((route) => {
          const active = isActive(route)
          return route.children?.length ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-0 px-4">
                <AccordionTrigger>{route.title}</AccordionTrigger>
                <AccordionContent>
                  <nav className="flex flex-col gap-y-2">
                    {route.children.map((child) => (
                      <Button
                        key={child.title}
                        variant={
                          pathname === child.href ? "secondary" : "ghost"
                        }
                        onClick={() => onClick(child.href)}
                        className="flex w-full justify-start"
                      >
                        {child.title}
                      </Button>
                    ))}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <nav className="flex flex-col gap-y-2">
              <Button
                key={route.title}
                variant={active ? "secondary" : "ghost"}
                onClick={() => onClick(route.href ?? "")}
                className="flex w-full justify-start"
              >
                {route.title}
              </Button>
            </nav>
          )
        })}
      </SheetContent>
    </Sheet>
  )
}
