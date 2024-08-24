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
          <DateInput form={form} />
          <FundInput form={form} name="senderId" label="الصندوق المرسل" />
          <FundInput form={form} name="receiverId" label="الصندوق المستلم" />
          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
