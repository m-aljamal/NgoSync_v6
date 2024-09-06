"use client"

import * as React from "react"
import { useMemo } from "react"
import { donations } from "@/db/schemas/donation"
import { Plus, X } from "lucide-react"
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form"

import { formatCurrency } from "@/lib/utils"
import {
  useGetCurrencies,
  useGetDoners,
  useGetExpensesCategoriesByProjectId,
} from "@/hooks/use-get-form-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import AmountInput from "@/components/form-components/amount-input"
import CurrencyAmountInput from "@/components/form-components/currency-amount-input"
import { DatePicker } from "@/components/form-components/date-picker"
import FundInput from "@/components/form-components/fund-input"
import InputGroup from "@/components/form-components/InputGroup"
import ProjectInput from "@/components/form-components/project-input"
import { AppSelect } from "@/components/form-components/select"
import { donationPaymentTypeTranslation } from "@/app/_lib/translate"
import {
  CreateDonationSchema,
  CreateLoanSchema,
  type CreateProposalSchema,
} from "@/app/_lib/validations"
import { DateInput } from "@/components/form-components"

interface CreateLoanFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateLoanSchema>
  onSubmit: (data: CreateLoanSchema) => void
  isUpdate?: boolean
}

export function LoanForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateLoanFormProps) {

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <DateInput form={form} />



          <CurrencyAmountInput form={form} />
          <FundInput form={form} />
          {/* <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>طريقة الدفع</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={donations.paymentType.enumValues?.map((type) => ({
                    value: type,
                    label: donationPaymentTypeTranslation[type],
                  }))}
                  placeholder="أختر طريقة الدفع"
                />
                <FormMessage />
              </FormItem>
            )}
          /> */}

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

          <ProjectInput form={form} withProposals />



        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
