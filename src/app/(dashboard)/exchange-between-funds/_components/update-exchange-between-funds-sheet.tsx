"use client"

import * as React from "react"
import { type ExchangeBetweenFundsWithRelations } from "@/db/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateExchangeBetweenFunds } from "@/app/_lib/actions/currency"
import {
  createExchangeSchema,
  type CreateExchangeSchema,
} from "@/app/_lib/validations"

import { ExchangeBetweenFundsForm } from "./exchange-between-funds-form"

interface UpdateExchangeBetweenFundsSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  transfer: ExchangeBetweenFundsWithRelations
}

export function UpdateExchangeBetweenFundsSheet({
  transfer,
  ...props
}: UpdateExchangeBetweenFundsSheetProps) {
  const defaultValues: CreateExchangeSchema = React.useMemo(() => {
    return {
      date: new Date(transfer.date),
      id: transfer.id,
      senderId: transfer.senderFundId,
      receiverId: transfer.receiverFundId,
      fromAmount: new Decimal(transfer.fromAmount),
      toAmount: new Decimal(transfer.toAmount),
      fromCurrencyId: transfer.fromCurrencyId,
      toCurrencyId: transfer.toCurrencyId,
      description: transfer.description ?? "",
      rate: new Decimal(transfer.rate),
    }
  }, [transfer])

  const form = useForm<CreateExchangeSchema>({
    resolver: zodResolver(createExchangeSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [transfer, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(updateExchangeBetweenFunds, {
    onSuccess: async () => {
      toast.success("تم تعديل الصرف")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الصرف")
    },
  })

  async function onSubmit(input: CreateExchangeSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <ExchangeBetweenFundsForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </ExchangeBetweenFundsForm>
    </UpdateSheet>
  )
}
