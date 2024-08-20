"use client"

import * as React from "react"
import { useMemo } from "react"
import { doners } from "@/db/schema"
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form"

import { useGetFormData } from "@/hooks/use-get-users"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import AmountInput from "@/components/amount-input"
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
  const { fields, append, remove } = useFieldArray({
    name: "proposalExpenseCategories",
    control: form.control,
  })
  const { data: projects, isLoading: projectsLoading } =
    useGetFormData("projects")
  const { data: currencies, isLoading: currenciesLoading } =
    useGetFormData("currencies")

  const selectedCurrencyId = useWatch({
    control: form.control,
    name: "currencyId",
  })
  const selectedCurrency = useMemo(() => {
    return currencies?.find((currency) => currency.id === selectedCurrencyId)
  }, [selectedCurrencyId, currencies])

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
                  <Input type="text" placeholder="اسم الدراسة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المشروع</FormLabel>
                <AppSelect
                  isLoading={projectsLoading}
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={projects?.map((project) => ({
                    value: project.id.toString(),
                    label: project.name,
                  }))}
                  placeholder="أختر المشروع"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currencyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العملة</FormLabel>
                <AppSelect
                  isLoading={currenciesLoading}
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={currencies?.map((currency) => ({
                    value: currency.id.toString(),
                    label: currency.name,
                  }))}
                  placeholder="أختر العملة"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>قيمة الدراسة</FormLabel>
                <FormControl>
                  <AmountInput
                    intlConfig={
                      selectedCurrency && {
                        locale: selectedCurrency.locale,
                        currency: selectedCurrency.code,
                      }
                    }
                    placeholder="0.00"
                    value={field.value}
                    onChange={field.onChange}
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
