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
import { IsOfficialInput } from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import { AppSelect } from "@/components/form-components/select"
import { type CreateCurrencySchema } from "@/app/_lib/validations"

import { currencyList } from "./currency-list"

interface CreateCurrencyFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateCurrencySchema>
  onSubmit: (data: CreateCurrencySchema) => void
}

export function CurrencyForm({
  form,
  onSubmit,
  children,
}: CreateCurrencyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
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
          <IsOfficialInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
