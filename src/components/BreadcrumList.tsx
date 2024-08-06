import { Fragment } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

interface BreadcrumListProps {
  links: { href: string; name: string }[]
}

export default function BreadcrumList({ links }: BreadcrumListProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, index) => (
          <Fragment key={link.href}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={link.href}>{link.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < links.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
