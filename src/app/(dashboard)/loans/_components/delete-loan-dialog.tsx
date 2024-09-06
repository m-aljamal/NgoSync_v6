"use client"

import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import * as React from "react"
import { toast } from "sonner"

import { deleteLoans } from "@/app/_lib/actions/loan"
import DeleteDialog from "@/components/delete-dialog"
import { type Dialog } from "@/components/ui/dialog"
import { type Loan } from "@/db/schemas/loan"

interface DeleteLoanDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  loans: Row<Loan>["original"][]
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
