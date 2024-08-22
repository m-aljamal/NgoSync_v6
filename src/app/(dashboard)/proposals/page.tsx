import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getProposals } from "@/app/_lib/queries/proposals"
import { searchParamsSchema } from "@/app/_lib/validations"

import { ProposalsTable } from "./_components/proposals-table"

export default function Proposals({ searchParams }: SearchParams) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getProposals(search)

  return (
    <div>
      <Heading
        title="الدراسات المالية"
        description="إدارة الدراسات المالية للمشاريع."
        icon="SquareKanban"
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
          <ProposalsTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
