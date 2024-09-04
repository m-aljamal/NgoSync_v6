import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getExchangeBetweenProjects } from "@/app/_lib/queries/currency"
import { searchParamsSchema } from "@/app/_lib/validations"

import { ExchangeBetweenProjectsTable } from "./_components/exchange-between-projects-table"

export default function ExchangeBetweenProjectsToProjects({
  searchParams,
}: SearchParams) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getExchangeBetweenProjects(search)

  return (
    <div>
      <Heading
        title="صرف عملات بين المشاريع"
        description="صرف عملات من مشروع إلى مشروع."
        icon="Boxes"
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
          <ExchangeBetweenProjectsTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
