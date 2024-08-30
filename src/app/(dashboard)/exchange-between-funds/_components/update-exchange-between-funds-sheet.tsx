"use client"

import * as React from "react"
import { type TransferBetweenFundsWithRelations } from "@/db/schemas/transfer"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateTransferBetweenFunds } from "@/app/_lib/actions/transfers"
import {
  CreateExchangeBetweenFundsSchema,
  createTransferSchema,
  type CreateTransferSchema,
} from "@/app/_lib/validations"

import { TransferBetweenFundsForm } from "./exchange-between-funds-form"
import { ExchangeBetweenFundsWithRelations } from "@/db/schemas"

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
      fromAmount: transfer,

      amount: transfer.amount,
      description: transfer.description ?? "",
      currencyId: transfer.currencyId,
    }
  }, [transfer])

  const form = useForm<CreateTransferSchema>({
    resolver: zodResolver(createTransferSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [transfer, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(updateTransferBetweenFunds, {
    onSuccess: async () => {
      toast.success("تم تعديل الحوالة")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الحوالة")
    },
  })

  async function onSubmit(input: CreateTransferSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <TransferBetweenFundsForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </TransferBetweenFundsForm>
    </UpdateSheet>
  )
}
