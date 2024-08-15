"use client"
"use memo"

import * as React from "react"
import { projects, type Project } from "@/db/schema"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useTasksTable } from "@/app/_components/tasks-table-provider"
import { type getProjects } from "@/app/_lib/queries/projects"
import {
  projectStatusTranslation,
  projectSystemTranslation,
} from "@/app/_lib/translate"
import { getStatusIcon } from "@/app/_lib/utils"

import { getColumns } from "./project-table-columns"
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions"

interface TasksTableProps {
  promise: ReturnType<typeof getProjects>
}

export function ProjectsTable({ promise }: TasksTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  // const { featureFlags } = useTasksTable()

  const { data, pageCount } = React.use(promise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Project>[] = [
    {
      label: "Title",
      value: "name",
      placeholder: "بحث عن عنوان",
    },
    {
      label: "الحالة",
      value: "status",
      options: projects.status.enumValues.map((status) => ({
        label: projectStatusTranslation[status],
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "النظام",
      value: "system",
      options: projects.system.enumValues.map((system) => ({
        label: projectSystemTranslation[system],
        value: system,
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    // enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    state: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
    /* */
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <TasksTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}
