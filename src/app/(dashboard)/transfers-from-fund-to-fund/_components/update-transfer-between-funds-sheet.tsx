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
  createTransferBetweenFundsSchema,
  type CreateTransferBetweenFundsSchema,
} from "@/app/_lib/validations"

import { TransferBetweenFundsForm } from "./transfer-between-funds-form"

interface UpdateTransferBetweenFundsSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  transfer: TransferBetweenFundsWithRelations
}

export function UpdateTransferBetweenFundsSheet({
  transfer,
  ...props
}: UpdateTransferBetweenFundsSheetProps) {
  const defaultValues: CreateTransferBetweenFundsSchema = React.useMemo(() => {
    return {
      date: new Date(transfer.date),
      id: transfer.id,
      amount: transfer.amount,
      description: transfer.description ?? "",
      currencyId: transfer.currencyId,
      senderId: transfer.senderFundId,
      receiverId: transfer.receiverFundId,
    }
  }, [transfer])

  const form = useForm<CreateTransferBetweenFundsSchema>({
    resolver: zodResolver(createTransferBetweenFundsSchema),
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

  async function onSubmit(input: CreateTransferBetweenFundsSchema) {
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
