"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import { FormButtons, FormDialog } from "@/components/form-components"
import { createDonation } from "@/app/_lib/actions/donation"
import {
  createDonationSchema,
  type CreateDonationSchema,
} from "@/app/_lib/validations"

import { DonationForm } from "./donation-form"

export function CreateDonationDialog() {
  const { isOpen, onOpen, onClose } = useFormDialog()

  const form = useForm<CreateDonationSchema>({
    resolver: zodResolver(createDonationSchema),
    defaultValues: {
      paymentType: "cash",
      description: "",
      receiptDescription: "",
      amountInText: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createDonation, {
    onSuccess: () => {
      toast.success("تم إنشاء التبرع")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateDonationSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <DonationForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </DonationForm>
    </FormDialog>
  )
}
