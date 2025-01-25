"use client"

import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { addEmployeesToCourses } from "@/app/_lib/actions/course"
import {
  createEmployeesToCourses,
  type CreateEmployeesToCourses,
} from "@/app/_lib/validations"

import { EmployeeForm } from "./employee-form"

export function CreateEmployeeDialog() {
  const { courseId } = useParams<{ courseId: string }>()

  const { onClose } = useFormDialog()

  const form = useForm<CreateEmployeesToCourses>({
    resolver: zodResolver(createEmployeesToCourses),
    defaultValues: {
      courseId,
      teachers: [],
    },
  })

  const { executeAsync, isExecuting } = useAction(addEmployeesToCourses, {
    onSuccess: async () => {
      toast.success("تمت الإضافة")

      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateEmployeesToCourses) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <EmployeeForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </EmployeeForm>
    </FormDialog>
  )
}
