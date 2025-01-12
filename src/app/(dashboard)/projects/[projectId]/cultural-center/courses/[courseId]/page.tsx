import React from "react"
import { type SearchParams } from "@/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getCourse, getCourses } from "@/app/_lib/queries/course"
import { searchParamsSchema } from "@/app/_lib/validations"

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
          
        </React.Suspense>
      </Shell>
    </div>
  )
}
