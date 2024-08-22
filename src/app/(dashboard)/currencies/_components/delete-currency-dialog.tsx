"use client"

import * as React from "react"
import { type Currency } from "@/db/schemas/currency"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteCurrencies } from "@/app/_lib/actions/currency"

interface DeleteCurrencyDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  currencies: Row<Currency>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteCurrencyDialog({
  currencies,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCurrencyDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteCurrencies, {
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
    await executeAsync({ ids: currencies.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={currencies.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
