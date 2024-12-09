"use client"

import * as React from "react"
import { type Student } from "@/db/schemas/student"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { type Dialog } from "@/components/ui/dialog"
import DeleteDialog from "@/components/delete-dialog"
import { deleteStudents } from "@/app/_lib/actions/student"

interface DeleteStudentsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  students: Row<Student>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteStudentsDialog({
  students,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteStudentsDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteStudents, {
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
    await executeAsync({ ids: students.map((p) => p.id) })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={students.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
