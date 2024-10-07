"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import CurrencyAmountInput from "@/components/form-components/currency-amount-input"
import { DatePicker } from "@/components/form-components/date-picker"
import InputGroup from "@/components/form-components/InputGroup"
import ProjectInput from "@/components/form-components/project-input"
import { type CreateExpenseSchema } from "@/app/_lib/validations"

interface CreateExpenseFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExpenseSchema>
  onSubmit: (data: CreateExpenseSchema) => void
}

export function ExpenseForm({
  form,
  onSubmit,
  children,
}: CreateExpenseFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <CurrencyAmountInput form={form} />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التاريخ</FormLabel>
                <FormControl>
                  <DatePicker onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProjectInput form={form} withProposals withExpensesCategories />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel> ملاحظات</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ملاحظات"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isOfficial"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm sm:flex-row">
                <div className="space-y-0.5">
                  <FormLabel>توثيق رسمي</FormLabel>
                  <FormDescription>توثيق التبرع بشكل رسمي</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
