"use client"

import { type TransferFundToProjectWithRelations } from "@/db/schemas/transfer"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateTransferFundToProjectsDialog } from "./create-transfer-fund-to-projects-dialog"
import { DeleteTransferFundToProjectsDialog } from "./delete-transfer-fund-to-projects-dialog"

interface TransferFundToProjectTableToolbarActionsProps {
  table: Table<TransferFundToProjectWithRelations>
}

export function TransferFundToProjectTableToolbarActions({
  table,
}: TransferFundToProjectTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTransferFundToProjectsDialog
          transfer={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateTransferFundToProjectsDialog />
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
