import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { adminRouteProtection } from "@/app/_lib/auth"

interface Props {
  children: React.ReactNode
}

export default async function layout({ children }: Props) {
  await adminRouteProtection()
  const links: SidebarLinks = [
    {
      groupName: "التوثيق الرسمي",
      items: [
        {
          title: "البيانات",
          icon: "FileDigit",
          href: `/official-documents/overview`,
        },
        {
          title: "الحوالات",
          icon: "Import",
          href: `/official-documents/transfers`,
        },
        {
          title: "المصروفات",
          icon: "ArrowUpRight",
          href: `/official-documents/outcome`,
        },
        {
          href: `/official-documents/donations`,
          title: "التبرعات",
          icon: "HandCoins",
        },
      ],
    },
  ]

  const breadcrumbs = [
    { title: "التوثيق الرسمي", href: "/official-documents/overview" },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}
