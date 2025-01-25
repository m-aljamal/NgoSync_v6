"use client"

import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { addStudentsToCourses } from "@/app/_lib/actions/course"
import {
  createStudentsToCourses,
  type CreateStudentsToCourses,
} from "@/app/_lib/validations"

import { StudentForm } from "./students-form"

export function CreateStudentDialog() {
  const { courseId } = useParams<{ courseId: string }>()
  const { onClose } = useFormDialog()

  const form = useForm<CreateStudentsToCourses>({
    resolver: zodResolver(createStudentsToCourses),
    defaultValues: {
      courseId,
      students: [],
    },
  })

  const { executeAsync, isExecuting } = useAction(addStudentsToCourses, {
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

  async function onSubmit(input: CreateStudentsToCourses) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <StudentForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </StudentForm>
    </FormDialog>
  )
}
