import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { getProjectIncome } from "@/app/_lib/queries/project-transactions"
import { searchParamsSchema } from "@/app/_lib/validations"

import { IncomeTable } from "./_components/income-table"

export interface IndexPageProps {
  searchParams: SearchParams
  params: { projectId: string }
}
export default async function IncomePage({
  params,
  searchParams,
}: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)
  const data = getProjectIncome(search, params.projectId)

  return (
    <>
      <Heading
        title={`الإيرادات`}
        description="جميع إيرادات المشروع."
        icon="ArrowDownLeft"
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
          <IncomeTable promise={data} />
        </React.Suspense>
      </Shell>
    </>
  )
}
