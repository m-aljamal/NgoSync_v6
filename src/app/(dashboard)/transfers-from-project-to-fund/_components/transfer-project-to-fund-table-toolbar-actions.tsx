"use client"

import { type TransferProjectToFundWithRelations } from "@/db/schemas/transfer"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateTransferProjectToFundDialog } from "./create-transfer-project-to-fund-dialog"
import { DeleteTransferProjectToFundDialog } from "./delete-transfer-project-to-fund-dialog"

interface TransferProjectToFundTableToolbarActionsProps {
  table: Table<TransferProjectToFundWithRelations>
}

export function TransferProjectToFundTableToolbarActions({
  table,
}: TransferProjectToFundTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTransferProjectToFundDialog
          transfer={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateTransferProjectToFundDialog />
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
