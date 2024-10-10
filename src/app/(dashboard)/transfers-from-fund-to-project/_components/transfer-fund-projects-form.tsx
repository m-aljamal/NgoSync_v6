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

interface CreateTransferFundToProjectsFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateTransferSchema>
  onSubmit: (data: CreateTransferSchema) => void
}

export function TransferFundToProjectsForm({
  form,
  onSubmit,
  children,
}: CreateTransferFundToProjectsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <CurrencyAmountInput form={form} />
          <DateInput form={form} />
          <FundInput form={form} name="senderId" label="الصندوق المرسل" />
          <ProjectInput form={form} name="receiverId" label="المشروع المستلم" />
          <IsOfficialInput form={form} />
          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
