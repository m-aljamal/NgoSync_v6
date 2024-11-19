import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"

interface Props {
  children: React.ReactNode
}

export default async function layout({ children }: Props) {
  const links: SidebarLinks = [
    {
      groupName: "القروض",
      items: [
        {
          title: "بيانات القروض",
          icon: "NotepadText",
          href: `/loans/overview`,
        },

        {
          title: "قائمة القروض",
          href: `/loans/loans-list`,
          icon: "ArrowDownNarrowWide",
        },
      ],
    },
  ]

  const breadcrumbs = [{ title: "القروض", href: `/loans/overview` }]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}
