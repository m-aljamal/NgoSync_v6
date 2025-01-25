"use client"

import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import * as React from "react"
import { toast } from "sonner"

import { deleteEmployeeToCourse } from "@/app/_lib/actions/course"
import { TeachersList } from "@/app/_lib/queries/course"
import DeleteDialog from "@/components/delete-dialog"
import { type Dialog } from "@/components/ui/dialog"

interface DeleteEmployeeDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  employees: Row<TeachersList>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteEmployeesDialog({
  employees,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteEmployeeDialogProps) {
  const { executeAsync, isExecuting } = useAction(deleteEmployeeToCourse, {
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
    await executeAsync({ ids: employees.map((p) => p.id || "") })
    toast.dismiss()
  }

  return (
    <DeleteDialog
      {...props}
      showTrigger={showTrigger}
      length={employees.length}
      onDelete={onDelete}
      isExecuting={isExecuting}
    />
  )
}
