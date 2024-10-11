"use client"

import * as React from "react"
import { type TransferFundToProjectWithRelations } from "@/db/schemas/transfer"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateTransferFundToProject } from "@/app/_lib/actions/transfers"
import {
  createTransferSchema,
  type CreateTransferSchema,
} from "@/app/_lib/validations"

import { TransferFundToProjectsForm } from "./transfer-fund-projects-form"

interface UpdateTransferFundProjectsSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  transfer: TransferFundToProjectWithRelations
}

export function UpdateTransferFundToProjectsSheet({
  transfer,
  ...props
}: UpdateTransferFundProjectsSheetProps) {
  const defaultValues: CreateTransferSchema = React.useMemo(() => {
    return {
      date: new Date(transfer.date),
      id: transfer.id,
      amount: new Decimal(transfer.amount),
      description: transfer.description ?? "",
      currencyId: transfer.currencyId,
      senderId: transfer.senderFundId,
      receiverId: transfer.receiverProjectId,
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

  const { executeAsync, isExecuting } = useAction(updateTransferFundToProject, {
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
      <TransferFundToProjectsForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </TransferFundToProjectsForm>
    </UpdateSheet>
  )
}
