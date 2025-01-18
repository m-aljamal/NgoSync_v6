"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createExchangeBetweenProjects } from "@/app/_lib/actions/currency"
import {
  createExchangeSchema,
  type CreateExchangeSchema,
} from "@/app/_lib/validations"

import { ExchangeBetweenProjectsForm } from "./exchange-between-projects-form"

export function CreateExchangeBetweenProjectsDialog() {
  const { onClose, isOpen, onOpen } = useFormDialog()

  const form = useForm<CreateExchangeSchema>({
    resolver: zodResolver(createExchangeSchema),
    defaultValues: {
      description: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(
    createExchangeBetweenProjects,
    {
      onSuccess: () => {
        toast.success("تم إنشاء الصرف")
        form.reset()
        toast.dismiss()
        onClose()
      },
      onError: ({ error }) => {
        toast.error(error.serverError)
      },
    }
  )

  async function onSubmit(input: CreateExchangeSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <ExchangeBetweenProjectsForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </ExchangeBetweenProjectsForm>
    </FormDialog>
  )
}
