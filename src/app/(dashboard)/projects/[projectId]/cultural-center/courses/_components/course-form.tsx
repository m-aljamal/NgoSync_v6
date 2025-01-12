"use client"

import * as React from "react"
import { courses } from "@/db/schemas/course"
import { type UseFormReturn } from "react-hook-form"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DescriptionInput, ProjectInput } from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import NameInput from "@/components/form-components/name-input"
import { AppSelect } from "@/components/form-components/select"
import { courseStatusTranslation } from "@/app/_lib/translate"
import { type CreateCourseSchema } from "@/app/_lib/validations"

interface CourseFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateCourseSchema>
  onSubmit: (data: CreateCourseSchema) => void
}

export function CourseForm({ form, onSubmit, children }: CourseFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <NameInput
            form={form}
            name="name"
            placeholder="اسم الكورس"
            labelName="اسم الكورس"
          />

          <ProjectInput form={form} />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الكورس</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={courses.status.enumValues?.map((status) => ({
                    value: status,
                    label: courseStatusTranslation[status],
                  }))}
                  placeholder="حالة الكورس"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
