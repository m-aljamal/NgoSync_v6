"use client"

import * as React from "react"
import { type ExchangeBetweenProjectsWithRelations } from "@/db/schemas"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteExchangeBetweenProjects } from "@/app/_lib/actions/currency"

interface DeleteExchangeBetweenProjectsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  transfer: Row<ExchangeBetweenProjectsWithRelations>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteExchangeBetweenProjectsDialog({
  transfer,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteExchangeBetweenProjectsDialogProps) {
  const { executeAsync, isExecuting } = useAction(
    deleteExchangeBetweenProjects,
    {
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
    }
  )

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
