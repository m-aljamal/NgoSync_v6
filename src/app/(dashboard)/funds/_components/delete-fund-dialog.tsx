"use client"

import * as React from "react"
import { type Fund } from "@/db/schema"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteFunds } from "@/app/_lib/actions/fund"

interface DeleteFundDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  funds: Row<Fund>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteFundDialog({
  funds,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteFundDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteFunds, {
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
    await executeAsync({ ids: funds.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={funds.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
