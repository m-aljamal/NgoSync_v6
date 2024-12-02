"use client"

import { employees } from "@/db/schemas/employee"
import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import {
  employeeStatusTranslation,
  genderTranslation
} from "@/app/_lib/translate"
import {
 type CreateStudentSchema
} from "@/app/_lib/validations"
import {
  DateInput,
  DescriptionInput,
  ProjectInput
} from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import NameInput from "@/components/form-components/name-input"
import { AppSelect } from "@/components/form-components/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الطالب</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسم الطالب" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <NameInput form={form} name="name" placeholder="اسم الطالب" />
          <ProjectInput form={form} />
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

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الموظف</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={employees.status.enumValues?.map((status) => ({
                    value: status,
                    label: employeeStatusTranslation[status],
                  }))}
                  placeholder="حالة الموظف"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <DateInput form={form} name="birthDate" labelName="تاريخ الولادة" />

          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
