import React from "react"

import { getCourse } from "@/app/_lib/queries/course"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"

import TeachersList from "./_components/teachers"
import StudentsList from "./_components/students"
import Lessons from "./_components/lessons"

export default async function Course({
  params,
}: {
  params: {
    courseId: string
  }
}) {
  const course = await getCourse({ courseId: params.courseId })

  return (
    <div>
      <Heading
        title={course?.name || ""}
        description={course?.description || ""}
        icon="BookA"
      />
      <Shell className="gap-2">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <div className="space-y-8">
            <TeachersList courseId={params.courseId}/>
            <StudentsList courseId={params.courseId}/>
            <Lessons courseId={params.courseId}/>
          </div>
        </React.Suspense>
      </Shell>
    </div>
  )
}
