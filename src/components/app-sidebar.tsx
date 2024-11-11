"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type SidebarLinks } from "@/types"
import { ChevronLeft } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { icons } from "./layouts/icons"

type Breadcrumb = {
  title: string
  href: string
}

type AppSidebarProps = {
  children: React.ReactNode
  links: SidebarLinks
  breadcrumbs: Breadcrumb[]
}

export default function AppSidebar({ children, links, breadcrumbs }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" side="right" className="mt-16 pt-2">
        <SidebarContent>
          {links.map((group, index) => {
            return (
              <SidebarGroup key={`${group.groupName}_${index}`}>
                <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items?.map((item) => {
                      const Icon = icons[item.icon]
                      const isActive = item.href === pathname

                      return (
                        <div key={item.title}>
                          {!item.children ? (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild isActive={isActive}>
                                <Link href={item.href || ""}>
                                  <Icon className="text-muted-foreground" />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ) : (
                            <Collapsible
                              key={item.title}
                              asChild
                              defaultOpen={item.children?.some(
                                (child) => child.href === pathname
                              )}
                              className="group/collapsible"
                            >
                              <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={isActive}
                                  >
                                    <Icon />
                                    <span>{item.title}</span>
                                    <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {item.children?.map((subItem) => {
                                      const ChildIcon =
                                        subItem.icon && icons[subItem.icon]
                                      const isActive = subItem.href === pathname

                                      return (
                                        <SidebarMenuSubItem key={subItem.title}>
                                          <SidebarMenuSubButton
                                            asChild
                                            isActive={isActive}
                                          >
                                            <Link href={subItem.href}>
                                              {ChildIcon && (
                                                <ChildIcon className="text-muted-foreground" />
                                              )}
                                              <span>{subItem.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      )
                                    })}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuItem>
                            </Collapsible>
                          )}
                        </div>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          })}
        </SidebarContent>

        <SidebarRail />
      </Sidebar>
      <SidebarInset className="-mx-8 -mt-5">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-mr-1" />
            <Separator orientation="vertical" className="ml-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}