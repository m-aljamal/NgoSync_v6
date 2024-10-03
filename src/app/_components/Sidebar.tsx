import { Fragment } from "react"
import { type PageLinks } from "@/types"

import { NavLink } from "./NavLink"

export default function Sidebar({ links }: { links: PageLinks }) {
  return (
    <div className="fixed bottom-0 top-[65px] hidden w-[150px] border-l sm:flex md:w-[180px]">
      <div className="my-8 ml-2">
        {links?.map((link) => (
          <div className="py-2" key={link.title}>
            {!link.children ? (
              <NavLink
                link={{
                  href: link.href || "",
                  icon: link.icon,
                }}
              >
                {link.title}
              </NavLink>
            ) : (
              <Fragment key={link.title}>
                <h2 className="mb-2 font-semibold tracking-tight">
                  {link.title}
                </h2>
                <div className="space-y-1">
                  {link.children.map((child) => (
                    <NavLink
                      link={{
                        href: child.href,
                        icon: child.icon,
                      }}
                      key={child.href}
                    >
                      {child.title}
                    </NavLink>
                  ))}
                </div>
              </Fragment>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
