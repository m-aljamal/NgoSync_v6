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
import InputGroup from "@/components/InputGroup"
import { type CreateFundSchema } from "@/app/_lib/validations"

interface CreateFundFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateFundSchema>
  onSubmit: (data: CreateFundSchema) => void
  isUpdate?: boolean
}

export function FundForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateFundFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الصندوق</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسم الصندوق" {...field} />
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
