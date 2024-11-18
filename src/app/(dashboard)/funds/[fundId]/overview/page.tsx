import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getFundAccountSummary } from "@/app/_lib/queries/funds"

import { FundOverviewTable } from "./_components/fund-overview-table"

export default async function FundOverview({
  params,
}: {
  params: { fundId: string }
}) {
  const summary = getFundAccountSummary(params.fundId)

  return (
    <div className="grid items-start gap-6 space-y-5 rounded-lg lg:grid-cols-2 xl:grid-cols-2">
      <div className="col-span-2 grid items-start gap-6 xl:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle> الداخل / الخارج</CardTitle>
              <CardDescription className="mt-1">
                تفاصيل الداخل و الخارج من الصندوق
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
            >
              <FundOverviewTable promise={summary} />
            </React.Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
