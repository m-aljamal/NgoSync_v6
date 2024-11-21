"use client"

import * as React from "react"
import { type TransferFundToProjectWithRelations } from "@/db/schemas/transfer"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteTransferFundToProject } from "@/app/_lib/actions/transfers"

interface DeleteTransferFundToProjectsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  transfer: Row<TransferFundToProjectWithRelations>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteTransferFundToProjectsDialog({
  transfer,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTransferFundToProjectsDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteTransferFundToProject, {
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
