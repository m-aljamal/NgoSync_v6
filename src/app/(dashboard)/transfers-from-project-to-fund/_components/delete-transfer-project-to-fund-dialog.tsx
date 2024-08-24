"use client"

import * as React from "react"
import { type TransferProjectToFundWithRelations } from "@/db/schemas/transfer"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteTransferProjectToFund } from "@/app/_lib/actions/transfers"

interface DeleteTransferProjectToFundDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  transfer: Row<TransferProjectToFundWithRelations>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteTransferProjectToFundDialog({
  transfer,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTransferProjectToFundDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteTransferProjectToFund, {
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
    const ids = transfer.reduce<string[]>((acc, p) => {
      acc.push(p.id, p.receiver, p.sender)
      return acc
    }, [])

    await executeAsync({ ids })

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
