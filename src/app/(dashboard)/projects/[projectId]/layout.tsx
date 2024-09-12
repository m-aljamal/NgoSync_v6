import { notFound, redirect } from "next/navigation"
import { type projects } from "@/db/schemas"
import { type PageLinks } from "@/types"

import PageLayout from "@/app/_components/page-layout"
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
console.log({project, user});

  if (!project) {
    notFound()
  }

  if (user?.role === "project_manager" && user.id !== project.userId) {
    redirect("/projects")
  }

  const schoolSystem: PageLinks = [
    {
      title: "بيانات المدرسة",

      children: [
        {
          href: `/projects/${project.id}/school-system/overview`,
          title: "بيانات المدرسة",
          icon: "Presentation",
          roles: ["admin"],
        },
        {
          href: `/projects/${project.id}/school-system/students`,
          title: "الطلاب",
          icon: "Users",
          roles: ["admin", "project_manager"],
        },
        {
          href: `/projects/${project.id}/school-system/teachers`,
          title: "المعلمين",
          icon: "Users",
          roles: ["admin", "project_manager"],
        },
        {
          href: `/projects/${project.id}/school-system/subjects`,
          title: "المواد",
          icon: "Users",
          roles: ["admin", "project_manager"],
        },
        {
          href: `/projects/${project.id}/school-system/classes`,
          title: "الصفوف",
          icon: "Users",
          roles: ["admin", "project_manager"],
        },
      ],
    },
  ]

  const culturalCenterSystem: PageLinks = [
    {
      title: "بيانات المركز",
      children: [
        {
          href: `/projects/${project.id}/cultural-center/courses`,
          title: "الدورات",
          icon: "SwatchBook",
          roles: ["admin", "project_manager"],
        },

        {
          href: `/projects/${project.id}/cultural-center/students`,
          title: "الطلاب",
          icon: "Users",
          roles: ["admin", "project_manager"],
        },
      ],
    },
  ]

  const systems: Record<typeof projects.$inferSelect.system, PageLinks> = {
    school: schoolSystem,
    cultural_center: culturalCenterSystem,
    relief: [],
    health: [],
    office: [],
  }

  const links: PageLinks = [
    {
      href: `/projects/${project.id}/overview`,
      title: "بيانات المشروع",
      icon: "Presentation",
      roles: ["admin", "project_manager"],
    },
    {
      title: "الحركات المالية",
      children: [
        {
          href: `/projects/${project.id}/income`,
          title: "الإيرادات",
          icon: "ArrowDownLeft",
          roles: ["admin", "project_manager"],
        },
        {
          href: `/projects/${project.id}/outcome`,
          title: "المصروفات",
          icon: "ArrowUpRight",
          roles: ["admin", "project_manager"],
        },
        {
          href: `/projects/${project.id}/donations`,
          title: "التبرعات",
          icon: "HandCoins",
          roles: ["admin"],
        },
        {
          href: `/projects/${project.id}/transfers`,
          title: "الحوالات",
          icon: "Import",
          roles: ["admin", "project_manager"],
        },
      ],
    },
    {
      title: "الموظفين",
      children: [
        {
          title: "الموظفين  ",
          href: `/projects/${project.id}/employees`,
          icon: "Users",
          roles: ["admin", "project_manager"],
        },
      ],
    },
    ...systems[project.system],
  ]

  return <PageLayout links={links}>{children}</PageLayout>
}
