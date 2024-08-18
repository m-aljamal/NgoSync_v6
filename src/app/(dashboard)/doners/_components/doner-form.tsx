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
import { type CreateDonerSchema } from "@/app/_lib/validations"

interface CreateDonerFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateDonerSchema>
  onSubmit: (data: CreateDonerSchema) => void
  isUpdate?: boolean
}

export function DonerForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateDonerFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المتبرع</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسم المتبرع" {...field} />
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
