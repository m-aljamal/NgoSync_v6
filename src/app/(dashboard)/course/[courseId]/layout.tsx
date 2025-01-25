import { notFound } from "next/navigation"
import { type SidebarLinks } from "@/types"

import AppSidebar from "@/components/app-sidebar"
import { currentUser } from "@/app/_lib/auth"
import { getCourse } from "@/app/_lib/queries/course"

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { courseId: string }
}) {
  const course = await getCourse({ courseId: params.courseId })

  const user = await currentUser()

  if (!course) {
    notFound()
  }

  // if (user?.role === "project_manager" && user.id !== project.userId) {
  //   redirect("/projects")
  // }

  const links: SidebarLinks = [
    {
      groupName: "المشروع",
      items: [
        {
          title: "بيانات الدورة ",
          icon: "Presentation",
          href: `/course/${params.courseId}`,
        },
        {
          title: "الطلاب",
          icon: "Users",
          href: `/course/${params.courseId}/students`,
        },
        {
          title: "المعلمين",
          icon: "Users",
          href: `/course/${params.courseId}/teachers`,
        },
        {
          title: "الدروس",
          icon: "Users",
          href: `/course/${params.courseId}/lessons`,
        },
      ],
    },
  ]

  const breadcrumbs = [
    {
      title: "الدورات",
      href:
        user?.role === "teacher"
          ? "/courses"
          : `/projects/${course.projectId}/cultural-center/courses`,
    },
    { title: course.name, href: `/course/${course.id}` },
  ]

  return (
    <AppSidebar links={links} breadcrumbs={breadcrumbs}>
      <main>{children}</main>
    </AppSidebar>
  )
}
