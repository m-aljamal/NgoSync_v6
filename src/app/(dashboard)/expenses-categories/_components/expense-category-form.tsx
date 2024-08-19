"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import { useGetFormData } from "@/hooks/use-get-users"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputGroup from "@/components/InputGroup"
import { AppSelect } from "@/components/select"
import { type CreateExpenseCategorySchema } from "@/app/_lib/validations"

interface CreateExpenseCategoryFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExpenseCategorySchema>
  onSubmit: (data: CreateExpenseCategorySchema) => void
  isUpdate?: boolean
}

export function ExpensesCategoryForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateExpenseCategoryFormProps) {
  const { data: projects, isLoading } = useGetFormData("projects")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم التصنيف</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسم الصندوق" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المشروع</FormLabel>
                <AppSelect
                  isLoading={isLoading}
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={projects?.map((project) => ({
                    value: project.id.toString(),
                    label: project.name,
                  }))}
                  placeholder="أختر المشروع"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
