"use client"

import * as React from "react"
import { type Currency } from "@/db/schemas/currency"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateCurrency } from "@/app/_lib/actions/currency"
import {
  createCurrencySchema,
  type CreateCurrencySchema,
} from "@/app/_lib/validations"

import { CurrencyForm } from "./currency-form"

interface UpdateCurrencySheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  currency: Currency
}

export function UpdateCurrencySheet({
  currency,
  ...props
}: UpdateCurrencySheetProps) {
  const form = useForm<CreateCurrencySchema>({
    resolver: zodResolver(createCurrencySchema),
    defaultValues: {
      code: currency.code,
      id: currency.id,
    },
  })

  React.useEffect(() => {
    form.reset({
      code: currency.code,
      id: currency.id,
    })
  }, [currency, form])

  const { executeAsync, isExecuting } = useAction(updateCurrency, {
    onSuccess: () => {
      toast.success("تم تعديل العملة")
      form.reset()
      props.onOpenChange?.(false)
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل العملة")
    },
  })

  async function onSubmit(input: CreateCurrencySchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <CurrencyForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </CurrencyForm>
    </UpdateSheet>
  )
}
