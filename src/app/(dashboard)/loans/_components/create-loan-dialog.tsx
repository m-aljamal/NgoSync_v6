"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  createLoanSchema,
  type CreateLoanSchema
} from "@/app/_lib/validations"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { useFormDialog } from "@/hooks/use-form-dialog"

import { createLoan } from "@/app/_lib/actions/loan"
import { LoanForm } from "./loan-form"

export function CreateLoanDialog() {
  const { onClose } = useFormDialog()

  const form = useForm<CreateLoanSchema>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      description: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createLoan, {
    onSuccess: () => {
      toast.success("تم إنشاء القرض")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateLoanSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <LoanForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </LoanForm>
    </FormDialog>
  )
}
