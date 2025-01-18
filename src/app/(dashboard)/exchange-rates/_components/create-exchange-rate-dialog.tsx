"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createExchangeRate } from "@/app/_lib/actions/currency"
import {
  createExchangeRateSchema,
  type CreateExchangeRateSchema,
} from "@/app/_lib/validations"

import { ExchangeRateForm } from "./exchange-form"

export function CreateExchangeRateDialog() {
  const { onClose, isOpen, onOpen } = useFormDialog()

  const form = useForm<CreateExchangeRateSchema>({
    resolver: zodResolver(createExchangeRateSchema),
  })

  const { executeAsync, isExecuting } = useAction(createExchangeRate, {
    onSuccess: () => {
      toast.success("تم إنشاء سعر الصرف")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateExchangeRateSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <ExchangeRateForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </ExchangeRateForm>
    </FormDialog>
  )
}
