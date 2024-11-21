import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getTransferFundToProject } from "@/app/_lib/queries/transfers"
import { searchParamsSchema } from "@/app/_lib/validations"

import { TransferFundToProjectTable } from "../../_components/transfer-fund-to-project/transfer-fund-to-projects-table"

export default function TransferFundToProject({ searchParams }: SearchParams) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getTransferFundToProject(search, true)

  return (
    <div>
      <Heading
        title="حوالات من الصناديق إلى المشاريع"
        description="تحويل مالي من صندوق إلى مشروع."
        icon="MoveUpRight"
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
          <TransferFundToProjectTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
