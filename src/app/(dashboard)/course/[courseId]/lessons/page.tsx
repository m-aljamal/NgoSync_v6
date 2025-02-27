import * as React from "react"
import type { SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getLessons } from "@/app/_lib/queries/course"
import { searchParamsSchema } from "@/app/_lib/validations"

import { LessonsTable } from "./_components/lessons-table"

export interface IndexPageProps {
  searchParams: SearchParams
  params: {
    courseId: string
  }
}
export default function Lessons({ searchParams, params }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getLessons(search, params.courseId)

  return (
    <div>
      <Heading
        title="الدروس"
        description="تفاصيل الدروس في الدورة"
        icon="Presentation"
      />

      <Shell className="gap-2">
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
          />
        </React.Suspense>
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
          <LessonsTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
