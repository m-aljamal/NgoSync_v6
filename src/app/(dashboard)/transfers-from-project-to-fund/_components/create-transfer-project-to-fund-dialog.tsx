"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createTransferProjectToFund } from "@/app/_lib/actions/transfers"
import {
  createTransferSchema,
  type CreateTransferSchema,
} from "@/app/_lib/validations"

import { TransferProjectToFundForm } from "./transfer-project-to-fund-form"

export function CreateTransferProjectToFundDialog() {
  const { onClose, isOpen, onOpen } = useFormDialog()

  const form = useForm<CreateTransferSchema>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      description: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createTransferProjectToFund, {
    onSuccess: () => {
      toast.success("تم إنشاء الحوالة")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateTransferSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <TransferProjectToFundForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </TransferProjectToFundForm>
    </FormDialog>
  )
}
