"use client"

import * as React from "react"
import { type UseFormReturn } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import InputGroup from "@/components/InputGroup"
import { AppSelect } from "@/components/select"
import { type CreateCurrencySchema } from "@/app/_lib/validations"

import { currencyList } from "./currency-list"

interface CreateCurrencyFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateCurrencySchema>
  onSubmit: (data: CreateCurrencySchema) => void
  isUpdate?: boolean
}

export function CurrencyForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateCurrencyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>العملة</FormLabel>
                <FormControl>
                  <AppSelect
                    onChange={field.onChange}
                    value={field.value}
                    options={currencyList.map((currency) => ({
                      label: currency.name,
                      value: currency.code,
                    }))}
                    placeholder="اختر العملة"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="official"
            render={({ field }) => (
              <FormItem className="col-span-2 flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm sm:flex-row">
                <div className="space-y-0.5">
                  <FormLabel>توثيق رسمي</FormLabel>
                  <FormDescription>هذه العملة للتوثيق الرسمي</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
