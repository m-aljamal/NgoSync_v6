"use client"

import * as React from "react"
import { type Project } from "@/db/schema"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteProjects } from "@/app/_lib/actions/project"

interface DeleteProjectDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  projects: Row<Project>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteProjectsDialog({
  projects,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteProjectDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteProjects, {
    onSuccess: () => {
      toast.success("تم الحذف بنجاح")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري الحذف")
    },
  })

  async function onDelete() {
    await executeAsync({ ids: projects.map((p) => p.id) })
    props.onOpenChange?.(false)
    toast.dismiss()
    onSuccess?.()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={projects.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
