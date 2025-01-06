import React from "react"

import { months } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CardSelect from "@/components/CardSelect"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getProjectExpensesByMonth } from "@/app/_lib/queries/projects"

import ExpensesStatisticsTable from "./expenses-statistics-table"

const ExpensesStatistics = async ({
  projectId,
  month,
}: {
  projectId: string
  month?: string
}) => {
  const expensesByMonth =
    (await getProjectExpensesByMonth({
      projectId,
      month,
    })) || []

  return (
    <div className="col-span-2 grid items-start gap-6 xl:col-span-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>المصروف الشهري</CardTitle>
            <CardDescription className="mt-1">
              تفاصيل المصروفات الشهرية
            </CardDescription>
          </div>
          <CardSelect
            items={[{ label: "ALL", value: "ALL" }, ...months]}
            name="month"
          />
        </CardHeader>
        <CardContent>
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={2}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={["10rem", "12rem", "12rem", "8rem"]}
                shrinkZero
              />
            }
          />
          <ExpensesStatisticsTable data={expensesByMonth} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpensesStatistics
