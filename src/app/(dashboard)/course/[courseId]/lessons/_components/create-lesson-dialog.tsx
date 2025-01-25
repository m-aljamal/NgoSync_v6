"use client"

import React from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import { useGetStudentsByCourseId } from "@/hooks/use-get-form-data"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createLesson } from "@/app/_lib/actions/course"
import {
  createLessonSchema,
  type CreateLessonSchema,
} from "@/app/_lib/validations"

import { LessonForm } from "./lesson-form"

export function CreateLessonDialog() {
  // todo projectId is static here update it to dynamiq

  const { courseId } = useParams<{
    courseId: string
  }>()
  const { onClose } = useFormDialog()
  const { data, isLoading } = useGetStudentsByCourseId("uhYfLIsvwLUc", courseId)

  const defaultValues: CreateLessonSchema = React.useMemo(() => {
    return {
      courseId,
      date: new Date(),
      title: "",
      description: "",
      students:
        data?.map((student) => ({
          studentId: student.id,
          name: student.name,
          note: "",
          attendance: "present",
          pageNumber: "",
          mark: "",
        })) ?? [],
    }
  }, [data, courseId])

  const form = useForm<CreateLessonSchema>({
    resolver: zodResolver(createLessonSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [form, data, defaultValues])

  const { executeAsync, isExecuting } = useAction(createLesson, {
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

  async function onSubmit(input: CreateLessonSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <LessonForm form={form} onSubmit={onSubmit} isLoading={isLoading}>
        <FormButtons isExecuting={isExecuting} />
      </LessonForm>
    </FormDialog>
  )
}
