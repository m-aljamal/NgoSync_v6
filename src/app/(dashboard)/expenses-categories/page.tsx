import type { SearchParams } from "@/types"
import * as React from "react"

import { getExpensesCategories } from "@/app/_lib/queries/project-transactions"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { Shell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

import { searchParamsSchema } from "../../_lib/validations"
import { ExpenseCategoriesTable } from "./_components/expense-category-table"

export interface IndexPageProps {
  searchParams: SearchParams
}
export default function ExpenseCategories({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const promise = getExpensesCategories(search)

  return (
    <div>
      <Heading
        title="تصنيفات المصاريف"
        description="تصنيفات المصاريف  المالية للمشاريع"
        icon="ClipboardList"
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
          <ExpenseCategoriesTable promise={promise} />
        </React.Suspense>
      </Shell>
    </div>
  )
}
