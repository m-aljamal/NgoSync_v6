import { notFound, redirect } from "next/navigation"
import { type projects } from "@/db/schemas"
import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { currentUser } from "@/app/_lib/auth"
import { getProject } from "@/app/_lib/queries/projects"

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  const project = await getProject({
    id: params.projectId,
  })
  const user = await currentUser()

  if (!project) {
    notFound()
  }

  if (user?.role === "project_manager" && user.id !== project.userId) {
    redirect("/projects")
  }

  const schoolSystem: SidebarLinks = [
    {
      groupName: "المدرسة",
      items: [
        {
          title: "بيانات المدرسة",
          icon: "Presentation",
          href: `/projects/${project.id}/school-system/overview`,
        },
        {
          title: "معلومات المدرسة",
          icon: "BriefcaseBusiness",
          children: [
            {
              href: `/projects/${project.id}/school-system/students`,
              title: "الطلاب",
              icon: "Users",
            },
            {
              href: `/projects/${project.id}/school-system/teachers`,
              title: "المعلمين",
              icon: "Users",
            },
            {
              href: `/projects/${project.id}/school-system/subjects`,
              title: "المواد",
              icon: "Users",
            },
            {
              href: `/projects/${project.id}/school-system/classes`,
              title: "الصفوف",
              icon: "Users",
            },
          ],
        },
      ],
    },
  ]

  const culturalCenterSystem: SidebarLinks = [
    {
      groupName: "المركز الثقافي",
      items: [
        {
          title: "بيانات المركز",
          icon: "Presentation",
          href: `/projects/${project.id}/cultural-center/overview`,
        },
        {
          title: "معلومات المركز",
          icon: "BriefcaseBusiness",
          children: [
            {
              href: `/projects/${project.id}/cultural-center/courses`,
              title: "الدورات",
              icon: "SwatchBook",
            },
            {
              href: `/projects/${project.id}/cultural-center/students`,
              title: "الطلاب",
              icon: "Users",
            },
          ],
        },
      ],
    },
  ]

  const systems: Record<typeof projects.$inferSelect.system, SidebarLinks> = {
    school: schoolSystem,
    cultural_center: culturalCenterSystem,
    relief: [],
    health: [],
    office: [],
  }

  const links: SidebarLinks = [
    {
      groupName: "المشروع",
      items: [
        {
          title: "بيانات المشروع",
          icon: "Presentation",
          href: `/projects/${project.id}/overview`,
        },

        {
          title: "الحركات المالية",
          icon: "ArrowDownUp",
          children: [
            {
              href: `/projects/${project.id}/income`,
              title: "الإيرادات",
              icon: "ArrowDownLeft",
            },
            {
              href: `/projects/${project.id}/outcome`,
              title: "المصروفات",
              icon: "ArrowUpRight",
            },
            {
              href: `/projects/${project.id}/donations`,
              title: "التبرعات",
              icon: "HandCoins",
            },
            {
              href: `/projects/${project.id}/transfers`,
              title: "الحوالات",
              icon: "Import",
            },
          ],
        },
        {
          title: "الموظفين",
          icon: "Users",
          children: [
            {
              title: "الموظفين  ",
              href: `/projects/${project.id}/employees`,
              icon: "Users",
            },
          ],
        },
      ],
    },
    ...systems[project.system],
  ]

  const breadcrumbs = [
    { title: "المشاريع", href: "/projects" },
    { title: project.name, href: `/projects/${project.id}` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}
