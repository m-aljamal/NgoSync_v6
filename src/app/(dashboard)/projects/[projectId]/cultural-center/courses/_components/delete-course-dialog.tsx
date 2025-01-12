"use client"

import * as React from "react"
import { type Course } from "@/db/schemas/course"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteCourses } from "@/app/_lib/actions/course"

interface DeleteCourseDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  courses: Row<Course>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteCouresDialog({
  courses,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCourseDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteCourses, {
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
    await executeAsync({ ids: courses.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={courses.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
