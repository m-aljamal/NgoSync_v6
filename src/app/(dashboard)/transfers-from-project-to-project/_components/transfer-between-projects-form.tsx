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
import InputGroup from "@/components/form-components/InputGroup"
import ProjectInput from "@/components/form-components/project-input"
import { type CreateTransferSchema } from "@/app/_lib/validations"

interface CreateTransferBetweenProjectsFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateTransferSchema>
  onSubmit: (data: CreateTransferSchema) => void
  isUpdate?: boolean
}

export function TransferBetweenProjectsForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateTransferBetweenProjectsFormProps) {
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

          <ProjectInput form={form} name="senderId" label="المشروع المرسل" />
          <ProjectInput form={form} name="receiverId" label="المشروع المستلم" />

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
