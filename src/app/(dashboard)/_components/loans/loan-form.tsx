"use client"

import * as React from "react"
import { loans } from "@/db/schemas/loan"
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
import { DateInput } from "@/components/form-components"
import CurrencyAmountInput from "@/components/form-components/currency-amount-input"
import InputGroup from "@/components/form-components/InputGroup"
import ProjectInput from "@/components/form-components/project-input"
import { AppSelect } from "@/components/form-components/select"
import { loanTypeTranslation } from "@/app/_lib/translate"
import { type CreateLoanSchema } from "@/app/_lib/validations"

interface CreateLoanFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateLoanSchema>
  onSubmit: (data: CreateLoanSchema) => void
}

export function LoanForm({ form, onSubmit, children }: CreateLoanFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع الحركة</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={loans.type.enumValues?.map((loan) => ({
                    value: loan,
                    label: loanTypeTranslation[loan],
                  }))}
                  placeholder="إختر الحركة"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <DateInput form={form} />
          <CurrencyAmountInput form={form} />

          <ProjectInput form={form} withEmployees />

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
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
