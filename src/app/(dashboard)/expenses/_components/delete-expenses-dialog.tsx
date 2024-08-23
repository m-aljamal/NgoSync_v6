"use client"

import * as React from "react"
import { type ProjectTransaction } from "@/db/schemas"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteExpenses } from "@/app/_lib/actions/project-transaction"

interface DeleteExpensesDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  expenses: Row<ProjectTransaction>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteExpensesDialog({
  expenses,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteExpensesDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteExpenses, {
    onSuccess: () => {
      toast.success("تم الحذف بنجاح")
      props.onOpenChange?.(false)
      onSuccess?.()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري الحذف")
    },
  })

  async function onDelete() {
    await executeAsync({ ids: expenses.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={expenses.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
