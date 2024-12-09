"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createStudent } from "@/app/_lib/actions/student"
import {
  createStudentSchema,
  type CreateStudentSchema,
} from "@/app/_lib/validations"

import { StudentForm } from "./student-form"

export function CreateStudentDialog() {
  const { onClose } = useFormDialog()

  const queryClient = useQueryClient()

  const form = useForm<CreateStudentSchema>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      status: "active",
      name: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createStudent, {
    onSuccess: async () => {
      toast.success("تم إنشاء الطالب")
      await queryClient.invalidateQueries({
        queryKey: ["students"],
      })
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateStudentSchema) {
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
