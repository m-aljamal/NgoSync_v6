import React from "react"
import { SearchParams } from "@/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getTeachers } from "@/app/_lib/queries/course"

import { EmployeesTable } from "./employees-table"
import { searchParamsSchema } from "@/app/_lib/validations"
import { getEmployees } from "@/app/_lib/queries/employees"

 

export default  function TeachersList({ courseId }: {courseId:string}) {
   const promise =  getTeachers({courseId})

  return (
    <Card>
      <CardHeader>
        <CardTitle>المدرسين</CardTitle>
        <CardDescription>قائمة مدرسين الكورس</CardDescription>
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
          <EmployeesTable promise={promise} />
        </React.Suspense>
      </CardContent>
    </Card>
  )
}

 