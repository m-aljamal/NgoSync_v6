"use client"

import * as React from "react"
import { type Proposal } from "@/db/schema"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteProposals } from "@/app/_lib/actions/proposal"

interface DeleteProposalDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  proposals: Row<Proposal>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteProposalDialog({
  proposals,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteProposalDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteProposals, {
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
    await executeAsync({ ids: proposals.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={proposals.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
