"use client"

import * as React from "react"
import { type ExchangeRate } from "@/db/schemas"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteExchangeRates } from "@/app/_lib/actions/currency"

interface DeleteExchangeRateDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  exchange: Row<ExchangeRate>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteExchangeRateDialog({
  exchange,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteExchangeRateDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteExchangeRates, {
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
    await executeAsync({ ids: exchange.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={exchange.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
