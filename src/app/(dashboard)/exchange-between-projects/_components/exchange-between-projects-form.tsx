"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import { Form } from "@/components/ui/form"
import {
  AmountInput,
  CurrencyAmountInput,
  DateInput,
  DescriptionInput,
  InputGroup,
  ProjectInput,
} from "@/components/form-components"
import { type CreateExchangeSchema } from "@/app/_lib/validations"

interface CreateExchangeBetweenProjectsFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExchangeSchema>
  onSubmit: (data: CreateExchangeSchema) => void
}

export function ExchangeBetweenProjectsForm({
  form,
  onSubmit,
  children,
}: CreateExchangeBetweenProjectsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <DateInput form={form} />
          <AmountInput form={form} name="rate" labelName="سعر الصرف" />

          <CurrencyAmountInput
            form={form}
            amountName="fromAmount"
            amountLabel=" من المبلغ"
            currencyName="fromCurrencyId"
            currencyLabel="من العملة"
          />

          <ProjectInput form={form} name="senderId" label="من المشروع" />

          <CurrencyAmountInput
            form={form}
            amountName="toAmount"
            amountLabel=" الى المبلغ"
            currencyName="toCurrencyId"
            currencyLabel="الى العملة"
          />

          <ProjectInput form={form} name="receiverId" label="الى المشروع" />

          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
