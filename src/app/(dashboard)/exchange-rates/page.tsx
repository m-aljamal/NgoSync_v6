import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getExchangeRates } from "@/app/_lib/queries/currency"
import { searchParamsSchema } from "@/app/_lib/validations"

import { ExchangeRateTable } from "./_components/exchange-rate-table"

export default function ExchangeRate({ searchParams }: SearchParams) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getExchangeRates(search)

  return (
    <div>
      <Heading
        title="أسعار الصرف"
        description="أسعار صرف العملات"
        icon="ArrowLeftRight"
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
          <ExchangeRateTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
