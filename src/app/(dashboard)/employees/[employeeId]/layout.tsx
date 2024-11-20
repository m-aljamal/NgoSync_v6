import { notFound } from "next/navigation"
import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { getEmployeeName } from "@/app/_lib/queries/employees"

interface Props {
  children: React.ReactNode
  params: {
    employeeId: string
  }
}

export default async function layout({ children, params }: Props) {
  const employee = await getEmployeeName(params.employeeId)

  if (!employee) {
    notFound()
  }

  const links: SidebarLinks = [
    {
      groupName: "الموظفين",
      items: [
        {
          title: "بيانات الموظف",
          icon: "ContactRound",
          href: `/employees/${employee.id}/overview`,
        },
        {
          href: `/employees/${employee.id}/loans`,
          title: "القروض",
          icon: "ArrowDownLeft",
        },
      ],
    },
  ]

  const breadcrumbs = [
    { title: "الموظفين", href: "/employees" },
    { title: employee.name, href: `/employees/${employee.id}` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}
