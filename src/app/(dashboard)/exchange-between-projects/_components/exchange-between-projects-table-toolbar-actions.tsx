"use client"

import { type ExchangeBetweenProjectsWithRelations } from "@/db/schemas"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateExchangeBetweenProjectsDialog } from "./create-exchange-between-projects-dialog"
import { DeleteExchangeBetweenProjectsDialog } from "./delete-exchange-between-projects-dialog"

interface ExchnageBetweenProjectsTableToolbarActionsProps {
  table: Table<ExchangeBetweenProjectsWithRelations>
}

export function ExchangeBetweenProjectsTableToolbarActions({
  table,
}: ExchnageBetweenProjectsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteExchangeBetweenProjectsDialog
          transfer={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateExchangeBetweenProjectsDialog />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "proposals",
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
