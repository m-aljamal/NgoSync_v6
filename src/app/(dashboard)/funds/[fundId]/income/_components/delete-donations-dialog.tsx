"use client"

import * as React from "react"
import { type Donation } from "@/db/schemas"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteDonations } from "@/app/_lib/actions/donation"

interface DeleteDonationsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  donations: Row<Donation>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteDonationsDialog({
  donations,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteDonationsDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteDonations, {
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
    await executeAsync({ ids: donations.map((p) => p.fundTransactionId) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={donations.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
