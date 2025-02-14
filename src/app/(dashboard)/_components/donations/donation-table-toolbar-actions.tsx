"use client"

import { type DonationWithRelations } from "@/db/schemas"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV, exportTableToPDF } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateDonationDialog } from "./create-donation-dialog"
import { DeleteDonationsDialog } from "./delete-donations-dialog"

interface DonationTableToolbarActionsProps {
  table: Table<DonationWithRelations>
}

export function DonationTableToolbarActions({
  table,
}: DonationTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteDonationsDialog
          donations={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateDonationDialog />

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "التبرعات",
            excludeColumns: ["select", "actions", "donerId"],
          })
        }
      >
        <DownloadIcon className="ml-2 size-4" aria-hidden="true" />
        تصدير
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToPDF(table, {
            filename: "الوصل",
            excludeColumns: ["select", "actions", "donerId"],
          })
        }
      >
        <DownloadIcon className="ml-2 size-4" aria-hidden="true" />
        تصدير PDF
      </Button>
    </div>
  )
}
