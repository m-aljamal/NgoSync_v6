"use client"

import * as React from "react"
import { type ExpensesCategory } from "@/db/schema"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteExpenseCategory } from "@/app/_lib/actions/project-transaction"

interface DeleteExpenseCategoryDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  expensesCategories: Row<ExpensesCategory>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteExpenseCategoryDialog({
  expensesCategories,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteExpenseCategoryDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteExpenseCategory, {
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
    await executeAsync({ ids: expensesCategories.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={expensesCategories.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
