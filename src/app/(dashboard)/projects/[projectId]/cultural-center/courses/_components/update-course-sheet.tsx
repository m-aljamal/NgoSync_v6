"use client"

import * as React from "react"
import { type Course } from "@/db/schemas/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateCourse } from "@/app/_lib/actions/course"
import {
  createCourseSchema,
  type CreateCourseSchema,
} from "@/app/_lib/validations"

import { CourseForm } from "./course-form"

interface UpdateCourseSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  course: Course
}

export function UpdateCourseSheet({
  course,
  ...props
}: UpdateCourseSheetProps) {
  const defaultValues: CreateCourseSchema = React.useMemo(() => {
    return {
      description: course.description || "",
      name: course.name,
      id: course.id,
      projectId: course.projectId,
      status: course.status,
    }
  }, [course])

  const form = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [course, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(updateCourse, {
    onSuccess: () => {
      toast.success("تم تعديل الكورس")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الكورس")
    },
  })

  async function onSubmit(input: CreateCourseSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <CourseForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </CourseForm>
    </UpdateSheet>
  )
}
