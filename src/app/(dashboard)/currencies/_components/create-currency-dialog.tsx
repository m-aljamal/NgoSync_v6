"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createCurrency } from "@/app/_lib/actions/currency"
import {
  createCurrencySchema,
  type CreateCurrencySchema,
} from "@/app/_lib/validations"

import { CurrencyForm } from "./currency-form"

export function CreateCurrencyDialog() {
  const { onClose } = useFormDialog()

  const form = useForm<CreateCurrencySchema>({
    resolver: zodResolver(createCurrencySchema),
  })

  const { executeAsync, isExecuting } = useAction(createCurrency, {
    onSuccess: () => {
      toast.success("تم إنشاء العملة")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateCurrencySchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <CurrencyForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </CurrencyForm>
    </FormDialog>
  )
}
