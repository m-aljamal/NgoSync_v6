import { type SearchParams } from "@/types"
import React from "react"

import { getTransferBetweenFunds } from "@/app/_lib/queries/transfers"
import { searchParamsSchema } from "@/app/_lib/validations"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

import {
  TransferBetweenFundsTable
} from "./_components/transfer-between-funds-table"

export default function TransferBetweenFundsToFunds({
  searchParams,
}: SearchParams) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getTransferBetweenFunds(search)

  return (
    <div>
      <Heading
        title="حوالات بين الصناديق"
        description="تحويل مالي من صندوق إلى صندق."
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
          <TransferBetweenFundsTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
