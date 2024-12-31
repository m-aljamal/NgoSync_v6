"use client"

import * as React from "react"
import { useMemo } from "react"
import Decimal from "decimal.js"
import { Plus, X } from "lucide-react"
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form"

import { formatCurrency } from "@/lib/utils"
import {
  useGetCurrencies,
  useGetExpensesCategoriesByProjectId,
} from "@/hooks/use-get-form-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import AmountInput from "@/components/form-components/amount-input"
import CurrencyAmountInput from "@/components/form-components/currency-amount-input"
import InputGroup from "@/components/form-components/InputGroup"
import ProjectInput from "@/components/form-components/project-input"
import { AppSelect } from "@/components/form-components/select"
import { type CreateProposalSchema } from "@/app/_lib/validations"

interface CreateProposalFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateProposalSchema>
  onSubmit: (data: CreateProposalSchema) => void
}

export function ProposalForm({
  form,
  onSubmit,
  children,
}: CreateProposalFormProps) {
  const { fields, append, remove } = useFieldArray({
    name: "proposalExpenseCategories",
    control: form.control,
  })

  const { data: currencies } = useGetCurrencies()

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

  const selectedAmount = useWatch({
    control: form.control,
    name: "amount",
  })

  const selectedExpenses = useWatch({
    control: form.control,
    name: "proposalExpenseCategories",
  })

  const remainingExpensesAmount = useMemo(() => {
    const totalExpenses = selectedExpenses?.reduce((acc, expense) => {
      return acc + (+expense.amount || 0)
    }, 0)

    return +selectedAmount - totalExpenses
  }, [selectedAmount, selectedExpenses])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
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
          <ProjectInput form={form} />

          <CurrencyAmountInput form={form} />

          <div className="col-span-full">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    قيمة الدراسة
                  </CardTitle>

                  <span className="font-bold text-muted-foreground">
                    {selectedCurrency && selectedCurrency.name}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(selectedCurrency &&
                      selectedAmount &&
                      formatCurrency(
                        +selectedAmount || 0,
                        selectedCurrency?.code
                      )) ??
                      0}
                  </div>
                  <p className="text-xs text-muted-foreground">قيمة الدراسة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    المتبقي للمصروفات
                  </CardTitle>

                  <span className="font-bold text-muted-foreground">
                    {selectedCurrency && selectedCurrency.name}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(selectedCurrency &&
                      selectedAmount &&
                      formatCurrency(
                        isNaN(remainingExpensesAmount)
                          ? 0
                          : remainingExpensesAmount,
                        selectedCurrency?.code
                      )) ??
                      0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    المبلغ المتبقي للمصروفات
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <Button
                type="button"
                className="col-span-full"
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
              <AmountInput
                name={`proposalExpenseCategories.${index}.amount`}
                form={form}
                labelName="المبلغ"
                currency={selectedCurrency?.code}
              />
            </React.Fragment>
          ))}

          <Button
            type="button"
            className="col-span-full"
            variant="ghost"
            onClick={() =>
              append({
                amount: new Decimal(0),
                expensesCategoryId: "",
              })
            }
            size="icon"
          >
            <Plus className="size-4 text-muted-foreground" />
          </Button>
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
