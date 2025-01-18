"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createExpense } from "@/app/_lib/actions/project-transaction"
import {
  createExpenseSchema,
  type CreateExpenseSchema,
} from "@/app/_lib/validations"

import { ExpenseForm } from "./expense-form"

export function CreateExpenseDialog() {
  const { onClose, isOpen, onOpen } = useFormDialog()

  const form = useForm<CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      description: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createExpense, {
    onSuccess: () => {
      toast.success("تم إنشاء المصروف")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateExpenseSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <ExpenseForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </ExpenseForm>
    </FormDialog>
  )
}
