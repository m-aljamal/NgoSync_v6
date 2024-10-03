"use client"

import { Fragment, useMemo } from "react"
import {
  useWatch,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useGetCurrencies } from "@/hooks/use-get-form-data"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import AmountInput from "@/components/form-components/amount-input"
import { AppSelect } from "@/components/form-components/select"

export default function CurrencyAmountInput<T extends FieldValues>({
  form,
  currencyName = "currencyId",
  currencyLabel = "العملة",
  amountName = "amount",
  amountLabel = "المبلغ",
  withAmount = true,
}: {
  form: UseFormReturn<T>
  currencyName?: string
  currencyLabel?: string
  amountName?: string
  amountLabel?: string
  withAmount?: boolean
}) {
  const { data: currencies, isLoading: currenciesLoading } = useGetCurrencies()

  const selectedCurrencyId = useWatch({
    control: form.control,
    name: currencyName as Path<T>,
  })
  const selectedCurrency = useMemo(() => {
    return currencies?.find((currency) => currency.id === selectedCurrencyId)
  }, [selectedCurrencyId, currencies])

  return (
    <Fragment>
      <FormField
        control={form.control}
        name={currencyName as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{currencyLabel}</FormLabel>
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
      {withAmount ? (
        <AmountInput
          name={amountName as Path<T>}
          labelName={amountLabel}
          form={form}
          currency={selectedCurrency?.code}
        />
      ) : null}
    </Fragment>
  )
}
