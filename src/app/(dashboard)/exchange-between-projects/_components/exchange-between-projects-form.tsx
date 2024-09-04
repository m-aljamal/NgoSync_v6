"use client"

import * as React from "react"
import { useEffect, useMemo } from "react"
import { useWatch, type UseFormReturn } from "react-hook-form"

import { useGetCurrencies, useGetProjects } from "@/hooks/use-get-form-data"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AmountInput,
  DateInput,
  DescriptionInput,
  InputGroup,
} from "@/components/form-components"
import { AppSelect } from "@/components/form-components/select"
import { type CreateExchangeSchema } from "@/app/_lib/validations"

interface CreateExchangeBetweenProjectsFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateExchangeSchema>
  onSubmit: (data: CreateExchangeSchema) => void
  isUpdate?: boolean
}

export function ExchangeBetweenProjectsForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateExchangeBetweenProjectsFormProps) {
  const { data: currencies, isLoading: currenciesLoading } = useGetCurrencies()
  const { data: projects, isLoading: projectsLoading } = useGetProjects()

  const selectedFromCurrencyId = useWatch({
    control: form.control,
    name: "fromCurrencyId",
  })
  const selectedFromCurrency = useMemo(() => {
    return currencies?.find(
      (currency) => currency.id === selectedFromCurrencyId
    )
  }, [selectedFromCurrencyId, currencies])

  const selectedToCurrencyId = useWatch({
    control: form.control,
    name: "toCurrencyId",
  })

  const selectedToCurrency = useMemo(() => {
    return currencies?.find((currency) => currency.id === selectedToCurrencyId)
  }, [selectedToCurrencyId, currencies])

  const fromAmountValue = useWatch({
    control: form.control,
    name: "fromAmount",
  })

  const rateValue = useWatch({
    control: form.control,
    name: "rate",
  })

  useEffect(() => {
    if (fromAmountValue && rateValue) {
      const toAmount = fromAmountValue * rateValue
      form.setValue("toAmount", toAmount)
    }
  }, [fromAmountValue, rateValue, form])

  const toCurrenciesOptions = useMemo(() => {
    return currencies?.filter(
      (currency) => currency.id !== selectedFromCurrencyId
    )
  }, [selectedFromCurrencyId, currencies])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate} cols="grid-cols-3">
          <DateInput form={form} />

          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>سعر الصرف</FormLabel>
                <FormControl>
                  <AmountInput
                    intlConfig={
                      selectedToCurrency && {
                        locale: selectedToCurrency.locale,
                        currency: selectedToCurrency.code,
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

          <FormField
            control={form.control}
            name="fromCurrencyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>من العملة</FormLabel>
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
            name="fromAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>من المبلغ</FormLabel>
                <FormControl>
                  <AmountInput
                    intlConfig={
                      selectedFromCurrency && {
                        locale: selectedFromCurrency.locale,
                        currency: selectedFromCurrency.code,
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
          <FormField
            control={form.control}
            name="senderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>من المشروع</FormLabel>
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
            name="toCurrencyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الى العملة</FormLabel>
                <AppSelect
                  isLoading={currenciesLoading}
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={toCurrenciesOptions?.map((currency) => ({
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
            name="toAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الى المبلغ</FormLabel>
                <FormControl>
                  <AmountInput
                    intlConfig={
                      selectedToCurrency && {
                        locale: selectedToCurrency.locale,
                        currency: selectedToCurrency.code,
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
          <FormField
            control={form.control}
            name="receiverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الى المشروع</FormLabel>
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
          <DescriptionInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
