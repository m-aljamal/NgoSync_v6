import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getCourses, getLesson } from "@/app/_lib/queries/course"
import { searchParamsSchema } from "@/app/_lib/validations"


type SearchParamsProps = {
  searchParams: SearchParams
  params: {
    lessonId: string
  }
}

export default async function Lesson({ searchParams, params }: SearchParamsProps) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = await  getLesson( {id: params.lessonId})
console.log(promise);

  return (
    <div>
      <Heading
        title="الدورات"
        description="الدورات المتاحة في المركز الثقافي."
        icon="BookA"
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
          {/* <CoursesTable promise={promise} /> */}
          Table
        </React.Suspense>
      </Shell>
    </div>
  )
}
