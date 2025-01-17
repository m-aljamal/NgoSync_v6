import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getLessons } from "@/app/_lib/queries/course"

import { LessonsTable } from "./lessons-table"

export default function Lessons({ courseId }: { courseId: string }) {
  const promise = getLessons({ courseId })

  return (
    <Card>
      <CardHeader>
        <CardTitle>الدروس</CardTitle>
        <CardDescription> تفاصيل الدروس في الدورة</CardDescription>
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
          <LessonsTable promise={promise} />
        </React.Suspense>
      </CardContent>
    </Card>
  )
}
