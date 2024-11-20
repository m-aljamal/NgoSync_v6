"use client"

import * as React from "react"
import { type LoanWithRelations } from "@/db/schemas/loan"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteLoans } from "@/app/_lib/actions/loan"

interface DeleteLoanDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  loans: Row<LoanWithRelations>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteLoanDialog({
  loans,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteLoanDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteLoans, {
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
    await executeAsync({ ids: loans.map((p) => p.projectTransactionId) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={loans.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
