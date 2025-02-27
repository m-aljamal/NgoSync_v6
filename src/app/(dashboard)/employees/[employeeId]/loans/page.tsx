import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getLoans } from "@/app/_lib/queries/loans"
import { searchParamsSchema } from "@/app/_lib/validations"
import { LoanTable } from "@/app/(dashboard)/_components/loans/loans-table"

type Props = {
  searchParams: SearchParams
  params: {
    employeeId: string
  }
}

export default function Loans({ searchParams, params }: Props) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getLoans(search, params.employeeId)

  return (
    <div>
      <Heading
        title="القروض"
        description="إدارة القروض المالية للمنظمة."
        icon="NotepadText"
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
          <LoanTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
