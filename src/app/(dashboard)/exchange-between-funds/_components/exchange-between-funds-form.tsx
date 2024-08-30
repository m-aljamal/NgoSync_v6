"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import { Form } from "@/components/ui/form"
import {
  CurrencyAmountInput,
  DateInput,
  DescriptionInput,
  FundInput,
  InputGroup,
} from "@/components/form-components"
import { type CreateExchangeBetweenFundsSchema } from "@/app/_lib/validations"

interface CreateExchangeBetweenFundsFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExchangeBetweenFundsSchema>
  onSubmit: (data: CreateExchangeBetweenFundsSchema) => void
  isUpdate?: boolean
}

export function ExchangeBetweenFundsForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateExchangeBetweenFundsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate} cols="grid-cols-3">
          <FundInput form={form} name="senderId" label="الصندوق المرسل" />
          <CurrencyAmountInput
            form={form}
            amountName="fromAmount"
            amountLabel="من المبلغ"
            currencyName="fromCurrencyId"
            currencyLabel="من العملة"
          />
          <FundInput form={form} name="receiverId" label="الصندوق المستلم" />
          <CurrencyAmountInput
            form={form}
            amountName="toAmount"
            amountLabel="إلى المبلغ"
            currencyName="toCurrencyId"
            currencyLabel="إلى العملة"
          />
          <DateInput form={form} />
          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
