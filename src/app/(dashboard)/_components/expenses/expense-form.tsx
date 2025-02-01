"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import { Form } from "@/components/ui/form"
import {
  DateInput,
  DescriptionInput,
  IsOfficialInput,
} from "@/components/form-components"
import CurrencyAmountInput from "@/components/form-components/currency-amount-input"
import InputGroup from "@/components/form-components/InputGroup"
import ProjectInput from "@/components/form-components/project-input"
import { type CreateExpenseSchema } from "@/app/_lib/validations"

interface CreateExpenseFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExpenseSchema>
  onSubmit: (data: CreateExpenseSchema) => void
}
// todo make when choosing loan in the categories create the loan in the loans table
export function ExpenseForm({
  form,
  onSubmit,
  children,
}: CreateExpenseFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <DateInput form={form} />
          <CurrencyAmountInput form={form} />

          <ProjectInput form={form} withProposals withExpensesCategories />
          <DescriptionInput form={form} />
          <IsOfficialInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
