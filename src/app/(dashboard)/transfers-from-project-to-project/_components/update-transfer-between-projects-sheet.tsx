"use client"

import * as React from "react"
import { type TransferBetweenProjectsWithRelations } from "@/db/schemas/transfer"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateTransferBetweenProjects } from "@/app/_lib/actions/transfers"
import {
  createTransferSchema,
  type CreateTransferSchema,
} from "@/app/_lib/validations"

import { TransferBetweenProjectsForm } from "./transfer-between-projects-form"

interface UpdateTransferBetweenProjectsSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  transfer: TransferBetweenProjectsWithRelations
}

export function UpdateTransferBetweenProjectsSheet({
  transfer,
  ...props
}: UpdateTransferBetweenProjectsSheetProps) {
  const defaultValues: CreateTransferSchema = React.useMemo(() => {
    return {
      date: new Date(transfer.date),
      id: transfer.id,
      amount: new Decimal(transfer.amount),
      description: transfer.description ?? "",
      currencyId: transfer.currencyId,
      senderId: transfer.senderProjectId,
      receiverId: transfer.receiverProjectId,
    }
  }, [transfer])

  const form = useForm<CreateTransferSchema>({
    resolver: zodResolver(createTransferSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [transfer, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(
    updateTransferBetweenProjects,
    {
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
    }
  )

  async function onSubmit(input: CreateTransferSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <TransferBetweenProjectsForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </TransferBetweenProjectsForm>
    </UpdateSheet>
  )
}
