"use client"

import * as React from "react"
import { type Doner } from "@/db/schema"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteDoners } from "@/app/_lib/actions/doner"

interface DeleteDonerDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  doners: Row<Doner>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteDonersDialog({
  doners,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteDonerDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteDoners, {
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
    await executeAsync({ ids: doners.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={doners.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
