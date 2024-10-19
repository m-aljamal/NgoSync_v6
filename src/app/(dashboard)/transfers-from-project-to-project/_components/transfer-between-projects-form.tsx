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
import { type CreateTransferSchema } from "@/app/_lib/validations"

interface CreateTransferBetweenProjectsFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateTransferSchema>
  onSubmit: (data: CreateTransferSchema) => void
}

export function TransferBetweenProjectsForm({
  form,
  onSubmit,
  children,
}: CreateTransferBetweenProjectsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
          <DateInput form={form} />
          <CurrencyAmountInput form={form} />

          <ProjectInput form={form} name="senderId" label="المشروع المرسل" />
          <ProjectInput form={form} name="receiverId" label="المشروع المستلم" />

          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
