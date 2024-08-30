"use client"

import { type ExchangeBetweenFundsWithRelations } from "@/db/schemas"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateExchangeBetweenFundsDialog } from "./create-exchange-between-funds-dialog"
import { DeleteExchangeBetweenFundsDialog } from "./delete-exchange-between-funds-dialog"

interface ExchnageBetweenFundsTableToolbarActionsProps {
  table: Table<ExchangeBetweenFundsWithRelations>
}

export function ExchangeBetweenFundsTableToolbarActions({
  table,
}: ExchnageBetweenFundsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteExchangeBetweenFundsDialog
          transfer={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateExchangeBetweenFundsDialog />
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
