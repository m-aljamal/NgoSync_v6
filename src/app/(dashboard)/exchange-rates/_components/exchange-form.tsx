"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import { Form } from "@/components/ui/form"
import {
  CurrencyAmountInput,
  DateInput,
  DescriptionInput,
  InputGroup,
  ProjectInput,
} from "@/components/form-components"
import { CreateExpenseSchema, type CreateTransferSchema } from "@/app/_lib/validations"

interface ExchangeRateFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExpenseSchema>
  onSubmit: (data: CreateExpenseSchema) => void
  isUpdate?: boolean
}

export function ExchangeRateForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: ExchangeRateFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <CurrencyAmountInput form={form} />
          <DateInput form={form} />

          <ProjectInput form={form} name="senderId" label="المشروع المرسل" />
          <ProjectInput form={form} name="receiverId" label="المشروع المستلم" />

          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
