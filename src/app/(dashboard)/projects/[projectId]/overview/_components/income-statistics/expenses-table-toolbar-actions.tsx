"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { type StatisticsColumn } from "./encome-statistics-overview-table-columns"

interface ExpensesOverviewTableToolbarActionsProps {
  table: Table<StatisticsColumn>
}

export function IncomeOverviewTableToolbarActions({
  table,
}: ExpensesOverviewTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "المصاريف",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="ml-2 size-4" aria-hidden="true" />
        تصدير
      </Button>
    </div>
  )
}
