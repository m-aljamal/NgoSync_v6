"use client"

import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useGetFunds } from "@/hooks/use-get-form-data"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AppSelect } from "@/components/form-components/select"

export default function FundInput<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>
}) {
  const { data: funds, isLoading: fundsLoading } = useGetFunds()

  return (
    <FormField
      control={form.control}
      name={"fundId" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>الصندوق</FormLabel>
          <AppSelect
            isLoading={fundsLoading}
            onChange={field.onChange}
            value={(field.value as string | undefined)?.toString()}
            options={funds?.map((fund) => ({
              value: fund.id.toString(),
              label: fund.name,
            }))}
            placeholder="أختر الصندوق"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
