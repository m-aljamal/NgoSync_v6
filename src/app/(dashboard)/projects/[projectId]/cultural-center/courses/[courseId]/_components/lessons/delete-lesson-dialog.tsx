"use client"

import * as React from "react"
import { type Lesson } from "@/db/schemas/course"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteLessons } from "@/app/_lib/actions/course"

interface DeleteLessonsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  lessons: Row<Lesson>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteLessonsDialog({
  lessons,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteLessonsDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteLessons, {
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
    await executeAsync({ ids: lessons.map((p) => p.id || "") })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={lessons.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
