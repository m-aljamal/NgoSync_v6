"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Controller, type UseFormReturn } from "react-hook-form"
import Select from "react-select"

import { useGetStudents } from "@/hooks/use-get-form-data"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DateInput, DescriptionInput } from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import NameInput from "@/components/form-components/name-input"
import {
  CreateLessonSchema,
  type CreateStudentsToCourses,
} from "@/app/_lib/validations"

interface CreateLessonFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateLessonSchema>
  onSubmit: (data: CreateLessonSchema) => void
}

export function LessonForm({
  form,
  onSubmit,
  children,
}: CreateLessonFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <NameInput
            form={form}
            labelName="عنوان الدرس"
            name="title"
            placeholder="عنوان الدرس"
          />
          <DateInput form={form} labelName="التاريخ" name="date" />
          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
