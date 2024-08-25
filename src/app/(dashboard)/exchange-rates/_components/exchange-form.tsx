"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import {
  CreateExchangeRateSchema
} from "@/app/_lib/validations"
import {
  CurrencyAmountInput,
  DateInput,
  InputGroup
} from "@/components/form-components"
import { Form } from "@/components/ui/form"

interface ExchangeRateFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExchangeRateSchema>
  onSubmit: (data: CreateExchangeRateSchema) => void
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
