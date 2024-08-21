"use client"
"use memo"

import * as React from "react"
import { projects, type Project } from "@/db/schema"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getProjects } from "@/app/_lib/queries/projects"
import {
  projectStatusTranslation,
  projectSystemTranslation,
} from "@/app/_lib/translate"
import { getStatusIcon } from "@/app/_lib/utils"

import { getColumns } from "./project-table-columns"
import { ProjectsTableToolbarActions } from "./projects-table-toolbar-actions"

interface ProjectTableProps {
  promise: ReturnType<typeof getProjects>
}

export function ProjectsTable({ promise }: ProjectTableProps) {
  const { data, pageCount } = React.use(promise)
 
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
    filterFields,
    state: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ProjectsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}
