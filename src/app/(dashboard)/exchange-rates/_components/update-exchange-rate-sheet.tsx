"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  createExchangeRateSchema,
  CreateExchangeRateSchema
} from "@/app/_lib/validations"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { type Sheet } from "@/components/ui/sheet"

import { updateExchangeRate } from "@/app/_lib/actions/currency"
import { ExchangeRate } from "@/db/schemas"
import { ExchangeRateForm } from "./exchange-form"

interface UpdateExchangeRateSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  exchange: ExchangeRate
}

export function UpdateTransferBetweenProjectsSheet({
  exchange,
  ...props
}: UpdateExchangeRateSheetProps) {
  const defaultValues: CreateExchangeRateSchema = React.useMemo(() => {
    return {
      date: new Date(exchange.date),
      id: exchange.id,
      rate: exchange.rate,
      fromCurrencyId: exchange.fromCurrencyId,
      toCurrencyId: exchange.toCurrencyId,
    }
  }, [exchange])

  const form = useForm<CreateExchangeRateSchema>({
    resolver: zodResolver(createExchangeRateSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [exchange, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(
    updateExchangeRate,
    {
      onSuccess: async () => {
        toast.success("تم تعديل سعر الصرف")
        props.onOpenChange?.(false)
        form.reset()
      },
      onError: ({ error }) => {
        toast.error(error.serverError)
      },
      onExecute: () => {
        toast.loading("جاري تعديل سعر الصرف")
      },
    }
  )

  async function onSubmit(input: CreateExchangeRateSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <ExchangeRateForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </ExchangeRateForm>
    </UpdateSheet>
  )
}
