import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getExchangeBetweenFunds } from "@/app/_lib/queries/currency"
import { getUsers } from "@/app/_lib/queries/user"
import { searchParamsSchema } from "@/app/_lib/validations"

export default function ExchangeBetweenFundsToFunds({
  searchParams,
}: SearchParams) {
  // todo add search
  const search = searchParamsSchema.parse(searchParams)
  const promise = getUsers()

  return (
    <div>
      <Heading
        title="المستخدمين"
        description="إدارة المستخدمين."
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
          {/* <ExchangeBetweenFundsTable promise={promise} /> */}
        </React.Suspense>
      </Shell>
    </div>
  )
}
