"use client"

import { useMemo } from "react"
import {
  useWatch,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useGetCurrencies } from "@/hooks/use-get-form-data"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import AmountInput from "@/components/form-components/amount-input"
import { AppSelect } from "@/components/form-components/select"

export default function CurrencyAmountInput<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>
}) {
  const { data: currencies, isLoading: currenciesLoading } = useGetCurrencies()

  const selectedCurrencyId = useWatch({
    control: form.control,
    name: "currencyId" as Path<T>,
  })
  const selectedCurrency = useMemo(() => {
    return currencies?.find((currency) => currency.id === selectedCurrencyId)
  }, [selectedCurrencyId, currencies])

  return (
    <div className="col-span-2">
      <div className="grid grid-cols-2 gap-x-2">
        <FormField
          control={form.control}
          name={"currencyId" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>العملة</FormLabel>
              <AppSelect
                isLoading={currenciesLoading}
                onChange={field.onChange}
                value={(field.value as string | undefined)?.toString()}
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
          name={"amount" as Path<T>}
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
      </div>
    </div>
  )
}
