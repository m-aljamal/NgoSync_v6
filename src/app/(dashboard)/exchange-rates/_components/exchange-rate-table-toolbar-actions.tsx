"use client"

import { type ExchangeRate } from "@/db/schemas"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateExchangeRateDialog } from "./create-exchange-rate-dialog"
import { DeleteExchangeRateDialog } from "./delete-exchange-rate-dialog"

interface ExchangeRateTableToolbarActionsProps {
  table: Table<ExchangeRate>
}

export function ExchangeRateTableToolbarActions({
  table,
}: ExchangeRateTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteExchangeRateDialog
          exchange={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateExchangeRateDialog />
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
