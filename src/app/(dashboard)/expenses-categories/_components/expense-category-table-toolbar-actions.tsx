"use client"

import { type ExpensesCategory } from "@/db/schema"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateExpenseCategoryDialog } from "./create-expense-dialog"
import { DeleteExpenseCategoryDialog } from "./delete-expense-category-dialog"

interface ExpenseCategoryTableToolbarActionsProps {
  table: Table<ExpensesCategory>
}

export function ExpenseCategoryTableToolbarActions({
  table,
}: ExpenseCategoryTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteExpenseCategoryDialog
          expensesCategories={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateExpenseCategoryDialog />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "projects",
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
