import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getDoners } from "@/app/_lib/queries/doners"
import { searchParamsSchema } from "@/app/_lib/validations"

import { DonersTable } from "./_components/doners-table"

export default function Doners({ searchParams }: SearchParams) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getDoners(search)

  return (
    <div>
      <Heading
        title="المتبرعين"
        description="إدارة المتبرعين للمنظمة"
        icon="HandCoins"
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
          <DonersTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
