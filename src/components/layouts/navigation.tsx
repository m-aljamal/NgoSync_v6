"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMedia } from "react-use"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { icons } from "./icons"
import MobileNavigation from "./mobile-navigation"
import { type Route } from "./routes"

export default function Navigation({ routes }: { routes: Route[] }) {
  const isMobile = useMedia("(max-width: 1024px)", false)

  const isActive = (route: (typeof routes)[0]) => {
    if (route.href && pathname === route.href) {
      return true
    }
    if (route.children) {
      return route.children.some((child) => pathname === child.href)
    }
    return false
  }
  const pathname = usePathname()
  if (isMobile) {
    return <MobileNavigation />
  }

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {routes?.map((route) => {
          const active = isActive(route)
          return route.children?.length ? (
            <NavigationMenuItem key={route.title}>
              <NavigationMenuTrigger
                className={
                  active
                    ? "bg-accent text-foreground"
                    : "text-foreground/70 transition-colors hover:text-foreground"
                }
              >
                {route.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-3 p-4 md:w-[650px] md:grid-cols-2 lg:w-[700px]">
                  {route.children.map((child) => (
                    <ListItem
                      key={child.title}
                      icon={child.icon}
                      title={child.title}
                      href={child.href}
                      active={pathname === child.href}
                    >
                      {child.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <Link
              href={route.href ?? ""}
              key={route.title}
              className={cn(
                "m-1 block select-none space-y-1 rounded-md p-3 text-sm font-medium leading-none text-foreground/70 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                active && "bg-accent text-accent-foreground"
              )}
            >
              {route.title}
            </Link>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface ListItemProps {
  title: string
  href: string
  icon?: keyof typeof icons
  children: React.ReactNode
  active: boolean
}

function ListItem({ children, title, href, icon, active }: ListItemProps) {
  const Component = icons[icon || "Backpack"]

  return (
    <li>
      <Link
        passHref
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          active && "bg-accent text-accent-foreground"
        )}
      >
        <NavigationMenuLink asChild>
          <div className="flex items-center gap-4">
            <Component className="size-5" />
            <div>
              <h2 className="pb-1 text-sm font-medium">{title}</h2>
              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </div>
        </NavigationMenuLink>
      </Link>
    </li>
  )
}
ListItem.displayName = "ListItem"
