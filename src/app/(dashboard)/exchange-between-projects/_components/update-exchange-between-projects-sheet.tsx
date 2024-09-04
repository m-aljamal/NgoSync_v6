"use client"

import * as React from "react"
import { type ExchangeBetweenProjectsWithRelations } from "@/db/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateExchangeBetweenProjects } from "@/app/_lib/actions/currency"
import {
  createExchangeSchema,
  type CreateExchangeSchema,
} from "@/app/_lib/validations"

import { ExchangeBetweenProjectsForm } from "./exchange-between-projects-form"

interface UpdateExchangeBetweenProjectsSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  transfer: ExchangeBetweenProjectsWithRelations
}

export function UpdateExchangeBetweenProjectsSheet({
  transfer,
  ...props
}: UpdateExchangeBetweenProjectsSheetProps) {
  const defaultValues: CreateExchangeSchema = React.useMemo(() => {
    return {
      date: new Date(transfer.date),
      id: transfer.id,
      senderId: transfer.senderProjectId,
      receiverId: transfer.receiverProjectId,
      fromAmount: transfer.fromAmount,
      toAmount: transfer.toAmount,
      fromCurrencyId: transfer.fromCurrencyId,
      toCurrencyId: transfer.toCurrencyId,
      description: transfer.description ?? "",
      rate: transfer.rate,
    }
  }, [transfer])

  const form = useForm<CreateExchangeSchema>({
    resolver: zodResolver(createExchangeSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [transfer, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(
    updateExchangeBetweenProjects,
    {
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
    }
  )

  async function onSubmit(input: CreateExchangeSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <ExchangeBetweenProjectsForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </ExchangeBetweenProjectsForm>
    </UpdateSheet>
  )
}
