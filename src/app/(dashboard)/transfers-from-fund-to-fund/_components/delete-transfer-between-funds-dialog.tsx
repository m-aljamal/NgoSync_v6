"use client"

import * as React from "react"
import { type TransferBetweenFunds } from "@/db/schemas/transfer"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteTransferBetweenFunds } from "@/app/_lib/actions/transfers"

interface DeleteTransferBetweenFundsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  transfer: Row<TransferBetweenFunds>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteTransferBetweenFundsDialog({
  transfer,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTransferBetweenFundsDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteTransferBetweenFunds, {
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
    await executeAsync({ ids: transfer.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={transfer.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
