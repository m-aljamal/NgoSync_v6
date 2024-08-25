"use client"

import { type TransferBetweenProjectsWithRelations } from "@/db/schemas/transfer"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateTransferBetweenProjectsDialog } from "./create-transfer-between-projects-dialog"
import { DeleteTransferBetweenProjectsDialog } from "./delete-transfer-between-projects-dialog"

interface TransferBetweenProjectsTableToolbarActionsProps {
  table: Table<TransferBetweenProjectsWithRelations>
}

export function TransferBetweenProjectsTableToolbarActions({
  table,
}: TransferBetweenProjectsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTransferBetweenProjectsDialog
          transfer={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateTransferBetweenProjectsDialog />
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
