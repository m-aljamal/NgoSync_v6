import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getCourseStudents, getTeachers } from "@/app/_lib/queries/course"
import { getStudents } from "@/app/_lib/queries/student"

import { StudentsTable } from "./students-table"

export default function StudentsList({ courseId }: { courseId: string }) {
  const promise = getCourseStudents({ courseId })

  return (
    <Card>
      <CardHeader>
        <CardTitle>الطلاب</CardTitle>
        <CardDescription>قائمة طلاب الكورس</CardDescription>
      </CardHeader>
      <CardContent>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={2}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <StudentsTable promise={promise} />
        </React.Suspense>
      </CardContent>
    </Card>
  )
}
