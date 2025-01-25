import { notFound } from "next/navigation"
import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { currentUser } from "@/app/_lib/auth"
import { getCourse } from "@/app/_lib/queries/course"

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const course = await getCourse({ courseId: params.courseId })

  const user = await currentUser()

  // if (!course) {
  //   notFound()
  // }

  // if (user?.role === "project_manager" && user.id !== project.userId) {
  //   redirect("/projects")
  // }

  const links: SidebarLinks = [
    {
      groupName: "الدورات",
      items: [
        {
          title: "جميع الدورات",
          icon: "Presentation",
          href: `/courses`,
        },
      ],
    },
  ]

  const breadcrumbs = [
    {
      title: "الدورات",
      href: `/courses`,
    },
    { title: "course.name", href: `/course/` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}
