import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getProposalStatistics } from "@/app/_lib/queries/proposals"

import { ProposalOverviewTable } from "./proposal-overview-table"

export default async function ProposalTableStatistics({
  proposalId,
}: {
  proposalId: string
}) {
  const proposalStatistics = getProposalStatistics(proposalId)
  return (
    <div className="col-span-2 grid items-start gap-6 xl:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle>المصروف / المتبقي</CardTitle>
          <CardDescription>تفاصيل المصروف والمتبقي من الدراسة</CardDescription>
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
            <ProposalOverviewTable promise={proposalStatistics} />
          </React.Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
