"use client"

import * as React from "react"
import { type Student } from "@/db/schemas/student"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateStudent } from "@/app/_lib/actions/student"
import {
  createStudentSchema,
  type CreateStudentSchema,
} from "@/app/_lib/validations"

import { StudentForm } from "./student-form"

interface UpdateStudentSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  student: Student
}

export function UpdateStudentSheet({
  student,
  ...props
}: UpdateStudentSheetProps) {
  const form = useForm<CreateStudentSchema>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {},
  })
  console.log(student)

  React.useEffect(() => {
    form.reset({
      id: student.id,
      name: student.name,
      gender: student.gender,
      phone: student.phone ?? "",
      projectId: student.projectId,
      dateOfBirth: new Date(student.dateOfBirth) ?? new Date(),
      registrationDate: new Date(student.registrationDate) ?? new Date(),
      description: student.description ?? "",
      status: student.status,
      address: student.address ?? "",
      fatherName: student.fatherName ?? "",
      motherName: student.motherName ?? "",
    })
  }, [student, form])

  const { executeAsync, isExecuting } = useAction(updateStudent, {
    onSuccess: () => {
      toast.success("تم تعديل الطالب")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الطالب")
    },
  })

  async function onSubmit(input: CreateStudentSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <StudentForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </StudentForm>
    </UpdateSheet>
  )
}
