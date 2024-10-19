"use client"

import * as React from "react"
import { type TransferProjectToFundWithRelations } from "@/db/schemas/transfer"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateTransferProjectToFund } from "@/app/_lib/actions/transfers"
import {
  createTransferSchema,
  type CreateTransferSchema,
} from "@/app/_lib/validations"

import { TransferProjectToFundForm } from "./transfer-project-to-fund-form"

interface UpdateTransferProjectToFundSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  transfer: TransferProjectToFundWithRelations
}

export function UpdateTransferProjectToFundSheet({
  transfer,
  ...props
}: UpdateTransferProjectToFundSheetProps) {
  const defaultValues: CreateTransferSchema = React.useMemo(() => {
    return {
      date: new Date(transfer.date),
      id: transfer.id,
      amount: new Decimal(transfer.amount),
      description: transfer.description ?? "",
      currencyId: transfer.currencyId,
      senderId: transfer.senderProjectId,
      receiverId: transfer.receiverFundId,
      isOfficial: transfer.isOfficial,
    }
  }, [transfer])

  const form = useForm<CreateTransferSchema>({
    resolver: zodResolver(createTransferSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [transfer, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(updateTransferProjectToFund, {
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
      <TransferProjectToFundForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </TransferProjectToFundForm>
    </UpdateSheet>
  )
}
