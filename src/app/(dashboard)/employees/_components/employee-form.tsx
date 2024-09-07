"use client"

import { employees } from "@/db/schemas/employee"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import * as React from "react"
import { type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { createEmployeeJobTitle } from "@/app/_lib/actions/employee"
import {
  employeePosisionTranslation,
  employeeStatusTranslation,
  genderTranslation,
} from "@/app/_lib/translate"
import { type CreateEmployeeSchema } from "@/app/_lib/validations"
import {
  CurrencyAmountInput,
  DateInput,
  DescriptionInput,
  ProjectInput,
} from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
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
import { useGetjobTitle } from "@/hooks/use-get-form-data"

interface CreateEmployeeFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateEmployeeSchema>
  onSubmit: (data: CreateEmployeeSchema) => void
  isUpdate?: boolean
}

export function EmployeeForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateEmployeeFormProps) {
  const queryClient = useQueryClient()

  const { executeAsync, isExecuting } = useAction(createEmployeeJobTitle, {
    onSuccess: async () => {
      toast.success("تم إنشاء المسمى الوظيفي")
      await queryClient.invalidateQueries({
        queryKey: ["jobTtile"],
      })
      form.reset()
      toast.dismiss()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onCreateJobTitle(value: string) {
    await executeAsync({ name: value })
  }

  const { data: jobTitels, isLoading: loadingJobTitles } = useGetjobTitle()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الموظف</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسم الموظف" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المنصب</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={employees.position.enumValues?.map((gender) => ({
                    value: gender,
                    label: employeePosisionTranslation[gender],
                  }))}
                  placeholder="المنصب"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المسمى الوظيفي</FormLabel>

                <AppSelect
                  creatable
                  isLoading={loadingJobTitles}
                  onCreate={onCreateJobTitle}
                  disabled={isExecuting}
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={jobTitels?.map((title) => ({
                    value: title.id.toString(),
                    label: title.name,
                  }))}
                  placeholder="أختر المسمى الوظيفي"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الايميل</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="com..@.." {...field} />
                </FormControl>
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

          <CurrencyAmountInput
            form={form}
            amountLabel="الراتب"
            amountName="salary"
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
