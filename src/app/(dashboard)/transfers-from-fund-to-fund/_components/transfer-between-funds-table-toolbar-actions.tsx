"use client"

import { type TransferBetweenFundsWithRelations } from "@/db/schemas/transfer"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateTransferBetweenFundsDialog } from "./create-transfer-between-funds-dialog"
import { DeleteTransferBetweenFundsDialog } from "./delete-transfer-between-funds-dialog"

interface TransferBetweenFundsTableToolbarActionsProps {
  table: Table<TransferBetweenFundsWithRelations>
}

export function TransferBetweenFundsTableToolbarActions({
  table,
}: TransferBetweenFundsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTransferBetweenFundsDialog
          transfer={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateTransferBetweenFundsDialog />
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
