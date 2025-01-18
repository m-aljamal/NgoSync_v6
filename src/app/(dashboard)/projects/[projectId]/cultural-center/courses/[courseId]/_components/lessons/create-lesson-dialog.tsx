"use client"

import { useParams } from "next/navigation"
import { Lesson } from "@/db/schemas/course"
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
  const { courseId, projectId } = useParams<{
    courseId: string
    projectId: string
  }>()
  const { isOpen, onOpen, onClose } = useFormDialog()
  const { data, isLoading } = useGetStudentsByCourseId(projectId, courseId)

  const defaultValues: Partial<CreateLessonSchema> = {
    courseId,
    students: data?.map((student) => ({
      studentId: student.id,
      name: student.name,
      note: "",
      attendance: "present",
      pageNumber: "",
      mark: "",
    })),
  }

  const form = useForm<CreateLessonSchema>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      courseId,
    },
  })

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
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <LessonForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </LessonForm>
    </FormDialog>
  )
}
