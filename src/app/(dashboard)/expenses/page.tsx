import { type SearchParams } from "@/types"

import Heading from "@/components/Heading"
import { getexpenses } from "@/app/_lib/queries/expenses"
import { searchParamsSchema } from "@/app/_lib/validations"

export interface IndexPageProps {
  searchParams: SearchParams
}
export default function Expenses({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)
  const promise = getexpenses(search)

  return (
    <div>
      <Heading
        title="المصاريف"
        description="المصاريف المالية للمنظمة"
        icon="Redo"
      />
      <Shell className="gap-2">
        {/* <TasksTableProvider> */}
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
          <ProjectsTable promise={promise} />
        </React.Suspense>
        {/* </TasksTableProvider> */}
      </Shell>
    </div>
  )
}
