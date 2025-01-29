import * as React from "react"
import type { SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getProjects } from "@/app/_lib/queries/projects"

import { searchParamsSchema } from "../../_lib/validations"
import { ProjectsTable } from "./_components/project-table"
import { getSalariesPayments } from "@/app/_lib/queries/employees"

export interface IndexPageProps {
  searchParams: SearchParams
}
export default function Salaries({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const promise = getSalariesPayments(search)

  return (
    <div>
      <Heading
        title="رواتب الموظفين"
        description="إدارة رواتب الموظفين."
        icon="Users"
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
          <ProjectsTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
