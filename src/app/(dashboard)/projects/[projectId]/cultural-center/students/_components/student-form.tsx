"use client"

import * as React from "react"
import { employees } from "@/db/schemas/employee"
import { students } from "@/db/schemas/student"
import { type UseFormReturn } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  DateInput,
  DescriptionInput,
  ProjectInput,
} from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import NameInput from "@/components/form-components/name-input"
import { AppSelect } from "@/components/form-components/select"
import {
  genderTranslation,
  studentStatusTranslation,
} from "@/app/_lib/translate"
import { type CreateStudentSchema } from "@/app/_lib/validations"

interface CreateStudentFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateStudentSchema>
  onSubmit: (data: CreateStudentSchema) => void
}

export function StudentForm({
  form,
  onSubmit,
  children,
}: CreateStudentFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <NameInput
            form={form}
            name="name"
            placeholder="اسم الطالب"
            labelName="اسم الطالب"
          />

          <NameInput
            form={form}
            name="fatherName"
            placeholder="اسم الأب"
            labelName="اسم الأب"
          />
          <NameInput
            form={form}
            name="motherName"
            placeholder="اسم الأم"
            labelName="اسم الأم"
          />
          <ProjectInput form={form} />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الطالب</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={students.status.enumValues?.map((status) => ({
                    value: status,
                    label: studentStatusTranslation[status],
                  }))}
                  placeholder="حالة الطالب"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الجنس</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={employees.gender.enumValues?.map((gender) => ({
                    value: gender,
                    label: genderTranslation[gender],
                  }))}
                  placeholder="الجنس"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0090536..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسطنبول - تركيا" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DateInput form={form} name="dateOfBirth" labelName="تاريخ الولادة" />
          <DateInput
            form={form}
            name="registrationDate"
            labelName="تاريخ التسجيل"
          />
          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
