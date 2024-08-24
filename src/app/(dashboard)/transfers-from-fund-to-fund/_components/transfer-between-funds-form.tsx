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
import { Input } from "@/components/ui/input"
import CurrencyAmountInput from "@/components/form-components/currency-amount-input"
import { DatePicker } from "@/components/form-components/date-picker"
import FundInput from "@/components/form-components/fund-input"
import InputGroup from "@/components/form-components/InputGroup"
import { type CreateTransferSchema } from "@/app/_lib/validations"

interface CreateTransferBetweenFundsFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateTransferSchema>
  onSubmit: (data: CreateTransferSchema) => void
  isUpdate?: boolean
}

export function TransferBetweenFundsForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateTransferBetweenFundsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
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

          <FundInput form={form} name="senderId" label="الصندوق المرسل" />
          <FundInput form={form} name="receiverId" label="الصندوق المستلم" />

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
