"use client"
"use memo"

import * as React from "react"
import { useRouter } from "next/navigation"
import { projects, type Project } from "@/db/schemas/project"
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
  const router = useRouter()

  React.useEffect(() => {
    let eventSource: EventSource | null = null

    const connectSSE = () => {
      eventSource = new EventSource('/api/sse')
      
      eventSource.onmessage = (event) => {
        if (event.data === 'update') {
          router.refresh()
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE error:', error)
        eventSource?.close()
        // Attempt to reconnect after 5 seconds
        setTimeout(connectSSE, 5000)
      }

      eventSource.onopen = () => {
        console.log('SSE connection opened')
      }
    }

    connectSSE()

    return () => {
      eventSource?.close()
    }
  }, [router])
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ProjectsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}
