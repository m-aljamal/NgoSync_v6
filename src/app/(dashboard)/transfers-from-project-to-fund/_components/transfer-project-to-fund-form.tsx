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
  IsOfficialInput,
  ProjectInput,
} from "@/components/form-components"
import { type CreateTransferSchema } from "@/app/_lib/validations"

interface CreateTransferProjectToFundFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateTransferSchema>
  onSubmit: (data: CreateTransferSchema) => void
}

export function TransferProjectToFundForm({
  form,
  onSubmit,
  children,
}: CreateTransferProjectToFundFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <DateInput form={form} />
          <CurrencyAmountInput form={form} />
          <ProjectInput form={form} name="senderId" label="المشروع المرسل" />
          <FundInput form={form} name="receiverId" label="الصندوق المستلم" />
          <IsOfficialInput form={form} />
          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
