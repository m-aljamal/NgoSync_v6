"use client"

import * as React from "react"
import { useMemo } from "react"
import { doners } from "@/db/schema"
import { X } from "lucide-react"
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form"

import {
  useGetCurrencies,
  useGetExpensesCategoriesByProjectId,
  useGetProjects,
} from "@/hooks/use-get-form-data"
import { Button } from "@/components/ui/button"
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

  const { data: projects, isLoading: projectsLoading } = useGetProjects()
  const { data: currencies, isLoading: currenciesLoading } = useGetCurrencies()

  const selectedCurrencyId = useWatch({
    control: form.control,
    name: "currencyId",
  })
  const selectedCurrency = useMemo(() => {
    return currencies?.find((currency) => currency.id === selectedCurrencyId)
  }, [selectedCurrencyId, currencies])

  const selectedProjectId = useWatch({
    control: form.control,
    name: "projectId",
  })

  const { data: expensesCategories, isLoading: loadingExpensesCategories } =
    useGetExpensesCategoriesByProjectId(selectedProjectId)

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
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <Button
                type="button"
                className="-my-4 sm:col-span-full"
                variant="ghost"
                onClick={() => remove(index)}
                size="icon"
              >
                <X className="size-4 text-muted-foreground" />
              </Button>
              <FormField
                control={form.control}
                name={`proposalExpenseCategories.${index}.expensesCategoryId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة</FormLabel>
                    <AppSelect
                      creatable
                      isLoading={loadingExpensesCategories}
                      onChange={field.onChange}
                      value={field.value?.toString()}
                      options={expensesCategories?.map((category) => ({
                        value: category.id.toString(),
                        label: category.name,
                      }))}
                      placeholder="أختر الفئة"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`proposalExpenseCategories.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ</FormLabel>
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
            </React.Fragment>
          ))}
          <div className="flex gap-x-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                append({
                  amount: 0,
                  expensesCategoryId: "",
                })
              }
            >
              إضافة بند
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(fields.length - 1)}
            >
              حذف بند
            </Button>
          </div>
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
