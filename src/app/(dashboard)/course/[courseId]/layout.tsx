import { notFound, redirect } from "next/navigation"
import { type projects } from "@/db/schemas"
import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { currentUser } from "@/app/_lib/auth"
import { getProject } from "@/app/_lib/queries/projects"

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  // const project = await getProject({
  //   id: params.projectId,
  // })
  const user = await currentUser()

  // if (!project) {
  //   notFound()
  // }

  // if (user?.role === "project_manager" && user.id !== project.userId) {
  //   redirect("/projects")
  // }

  const schoolSystem: SidebarLinks = [
    {
      groupName: "المدرسة",
      items: [
        {
          title: "بيانات المدرسة",
          icon: "Presentation",
          href: `/projects/school-system/overview`,
        },
        {
          title: "معلومات المدرسة",
          icon: "BriefcaseBusiness",
          children: [
            {
              href: `/projects/school-system/students`,
              title: "الطلاب",
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
          href: `/projects/cultural-center/overview`,
        },
        {
          title: "معلومات المركز",
          icon: "BriefcaseBusiness",
          children: [
            {
              href: `/projects/cultural-center/courses`,
              title: "الدورات",
              icon: "SwatchBook",
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
          href: `/projects/overview`,
        },

        {
          title: "الحركات المالية",
          icon: "ArrowDownUp",
          children: [
            {
              href: `/projects/income`,
              title: "الإيرادات",
              icon: "ArrowDownLeft",
            },
            
          ],
        },
         
      ],
    },
     
  ]

  const breadcrumbs = [
    { title: "الدورات", href: "/projects/uhYfLIsvwLUc/cultural-center/courses" },
    { title: "project.name", href: `/courses` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}
