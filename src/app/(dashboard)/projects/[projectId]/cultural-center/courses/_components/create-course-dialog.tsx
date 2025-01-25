"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createCourse } from "@/app/_lib/actions/course"
import {
  createCourseSchema,
  type CreateCourseSchema,
} from "@/app/_lib/validations"

import { CourseForm } from "./course-form"

export function CreateCourseDialog({
  params,
}: {
  params: { projectId: string }
}) {
  const { onClose } = useFormDialog()

  const queryClient = useQueryClient()

  const form = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      projectId: params.projectId,
      status: "active",
      name: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createCourse, {
    onSuccess: async () => {
      toast.success("تم إنشاء الكورس")
      await queryClient.invalidateQueries({
        queryKey: ["courses"],
      })
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateCourseSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <CourseForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </CourseForm>
    </FormDialog>
  )
}
