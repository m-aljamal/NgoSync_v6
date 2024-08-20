"use client"

import * as React from "react"
import { doners } from "@/db/schema"
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
import { AppSelect } from "@/components/select"
import {
  donerStatusTranslation,
  donerTypeTranslation,
  genderTranslation,
} from "@/app/_lib/translate"
import {
  CreateProposalSchema,
  type CreateDonerSchema,
} from "@/app/_lib/validations"

interface CreateProposalFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateProposalSchema>
  onSubmit: (data: CreateProposalSchema) => void
  isUpdate?: boolean
}

export function ProposalForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateProposalFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الدراسة</FormLabel>
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
