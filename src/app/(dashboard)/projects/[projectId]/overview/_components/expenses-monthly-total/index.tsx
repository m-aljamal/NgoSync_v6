import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getProjectMonthlyExpenses } from "@/app/_lib/queries/projects"

import ExpensesMonthlyTotelTable from "./expenses-total-table"

const ExpensesMonthlyTotal = async ({ projectId }: { projectId: string }) => {
  const monthlyExpenses = (await getProjectMonthlyExpenses(projectId)) || []

  return (
    <div className="col-span-2 grid items-start gap-6 xl:col-span-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle> مجموع الإنفاق</CardTitle>
            <CardDescription className="mt-1">
              تفاصيل الإنفاق الشهري
            </CardDescription>
          </div>
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
          <ExpensesMonthlyTotelTable data={monthlyExpenses} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpensesMonthlyTotal
