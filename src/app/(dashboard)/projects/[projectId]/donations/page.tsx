import React from "react"
import { type SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import Heading from "@/components/Heading"
import { RoleGate } from "@/components/RouteGate"
import { Shell } from "@/components/shell"
import { getDonations } from "@/app/_lib/queries/donations"
import { searchParamsSchema } from "@/app/_lib/validations"
import { DonationTable } from "@/app/(dashboard)/_components/donations/donation-table"

export interface IndexPageProps {
  searchParams: SearchParams
  params: { projectId: string }
}

export default function Donations({ searchParams, params }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const promise = getDonations({ input: search, projectId: params.projectId })

  return (
    <RoleGate allowedRoles={["admin"]}>
      <Heading
        title="التبرعات"
        description="التبرعات المالية للمشروع."
        icon="SquareKanban"
      />
      <Shell className="gap-2">
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="start"
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
          <DonationTable promise={promise} />
        </React.Suspense>
      </Shell>
    </RoleGate>
  )
}
