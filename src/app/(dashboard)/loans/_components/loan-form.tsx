"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import { loanTypeTranslation } from "@/app/_lib/translate"
import {
  type CreateLoanSchema
} from "@/app/_lib/validations"
import { DateInput } from "@/components/form-components"
import CurrencyAmountInput from "@/components/form-components/currency-amount-input"
import FundInput from "@/components/form-components/fund-input"
import InputGroup from "@/components/form-components/InputGroup"
import ProjectInput from "@/components/form-components/project-input"
import { AppSelect } from "@/components/form-components/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loans } from "@/db/schemas/loan"

interface CreateLoanFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateLoanSchema>
  onSubmit: (data: CreateLoanSchema) => void
  isUpdate?: boolean
}

export function LoanForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateLoanFormProps) {

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>

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
          <FundInput form={form} />
          <ProjectInput form={form} withProposals withEmployees />

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
