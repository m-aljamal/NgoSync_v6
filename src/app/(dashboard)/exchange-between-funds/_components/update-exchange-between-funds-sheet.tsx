"use client"

import * as React from "react"
import { type ExchangeBetweenFundsWithRelations } from "@/db/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateExchangeBetweenFunds } from "@/app/_lib/actions/currency"
import {
  createExchangeBetweenFundsSchema,
  type CreateExchangeBetweenFundsSchema,
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
  const defaultValues: CreateExchangeBetweenFundsSchema = React.useMemo(() => {
    return {
      date: new Date(transfer.date),
      id: transfer.id,
      senderId: transfer.senderFundId,
      receiverId: transfer.receiverFundId,
      fromAmount: transfer.fromAmount,
      toAmount: transfer.toAmount,
      fromCurrencyId: transfer.fromCurrencyId,
      toCurrencyId: transfer.toCurrencyId,
      description: transfer.description ?? "",
      rate: transfer.rate,
    }
  }, [transfer])

  const form = useForm<CreateExchangeBetweenFundsSchema>({
    resolver: zodResolver(createExchangeBetweenFundsSchema),
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

  async function onSubmit(input: CreateExchangeBetweenFundsSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <ExchangeBetweenFundsForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </ExchangeBetweenFundsForm>
    </UpdateSheet>
  )
}
