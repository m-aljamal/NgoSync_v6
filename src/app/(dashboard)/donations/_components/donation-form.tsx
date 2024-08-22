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
  type CreateProposalSchema,
} from "@/app/_lib/validations"

interface CreateDonationFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateDonationSchema>
  onSubmit: (data: CreateDonationSchema) => void
  isUpdate?: boolean
}

export function DonationForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateDonationFormProps) {
  const { data: doners, isLoading: loadingDoners } = useGetDoners()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التاريخ</FormLabel>
                <FormControl>
                  <DatePicker onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="donerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المتبرع</FormLabel>
                <AppSelect
                  isLoading={loadingDoners}
                  onChange={field.onChange}
                  value={(field.value as string | undefined)?.toString()}
                  options={doners?.map((doner) => ({
                    value: doner.id.toString(),
                    label: doner.name,
                  }))}
                  placeholder="أختر المتبرع"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <CurrencyAmountInput form={form} />
          <FundInput form={form} />
          <FormField
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
          />

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

          <FormField
            control={form.control}
            name="amountInText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المبلغ بالكتابة</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="المبلغ بالكتابة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receiptDescription"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>وصف الوصل</FormLabel>
                <FormControl>
                  <Input
                    placeholder="وصف الوصل"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isOfficial"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm sm:flex-row">
                <div className="space-y-0.5">
                  <FormLabel>توثيق رسمي</FormLabel>
                  <FormDescription>توثيق التبرع بشكل رسمي</FormDescription>
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
