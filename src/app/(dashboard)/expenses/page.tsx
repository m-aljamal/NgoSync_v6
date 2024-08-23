import { type SearchParams } from "@/types"
import React from "react"

import { getDonations } from "@/app/_lib/queries/donations"
import { searchParamsSchema } from "@/app/_lib/validations"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"
import { DonationTable } from "./_components/donation-table"

 
export default function Proposals({ searchParams }: SearchParams) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getDonations(search)

  return (
    <div>
      <Heading
        title="المصاريف"
        description="إدارة المصاريف المالية للمشاريع."
        icon="Redo"
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
          <DonationTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
