import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getEmployees } from "@/app/_lib/queries/employees"
import { searchParamsSchema } from "@/app/_lib/validations"
import { EmployeesTable } from "@/app/(dashboard)/_components/employees/employees-table"

type SearchParamsProps = {
  searchParams: SearchParams
  params: {
    projectId: string
  }
}

export default function Students({ searchParams, params }: SearchParamsProps) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getEmployees(search, params.projectId)

  return (
    <div>
      <Heading title="الطلاب" description="إدارة الطلاب" icon="Users" />
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
          <EmployeesTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
