import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getProjectMonthlyIncome } from "@/app/_lib/queries/projects"

import IncomeStatisticsTable from "./income-statistics-table"

const IncomeStatistics = async ({ projectId }: { projectId: string }) => {
  const monthlyIncome = (await getProjectMonthlyIncome(projectId)) || []

  return (
    <div className="col-span-2 grid items-start gap-6 xl:col-span-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>الواردات</CardTitle>
            <CardDescription className="mt-1">
              تفاصيل الواردات الشهرية
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
          <IncomeStatisticsTable data={monthlyIncome} />
        </CardContent>
      </Card>
    </div>
  )
}

export default IncomeStatistics
