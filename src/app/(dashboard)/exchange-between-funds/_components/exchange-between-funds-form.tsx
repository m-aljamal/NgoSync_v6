"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AmountInput,
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
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>سعر الصرف</FormLabel>
                <FormControl>
                  <AmountInput
                    intlConfig={
                      selectedToCurrency && {
                        locale: selectedToCurrency.locale,
                        currency: selectedToCurrency.code,
                      }
                    }
                    placeholder="0.00"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
