"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import { Form } from "@/components/ui/form"
import {
  CurrencyAmountInput,
  DateInput,
  InputGroup,
} from "@/components/form-components"
import { type CreateExchangeRateSchema } from "@/app/_lib/validations"

interface ExchangeRateFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExchangeRateSchema>
  onSubmit: (data: CreateExchangeRateSchema) => void
}

export function ExchangeRateForm({
  form,
  onSubmit,
  children,
}: ExchangeRateFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <DateInput form={form} />
          <CurrencyAmountInput
            form={form}
            currencyName="fromCurrencyId"
            currencyLabel="من العملة"
            amountLabel="سعر الصرف"
            amountName="rate"
          />
          <CurrencyAmountInput
            form={form}
            currencyName="toCurrencyId"
            currencyLabel="الى العملة"
            withAmount={false}
          />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
