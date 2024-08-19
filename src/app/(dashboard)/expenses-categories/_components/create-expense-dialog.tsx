"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-buttons"
import FormDialog from "@/components/form-dialog"
import { createExpenseCategory } from "@/app/_lib/actions/project-transaction"
import {
  createExpenseCategorySchema,
  type CreateExpenseCategorySchema,
} from "@/app/_lib/validations"

import { ExpensesCategoryForm } from "./expense-category-form"

export function CreateExpenseCategoryDialog() {
  const { onClose } = useFormDialog()

  const form = useForm<CreateExpenseCategorySchema>({
    resolver: zodResolver(createExpenseCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createExpenseCategory, {
    onSuccess: () => {
      toast.success("تم إنشاء التصنيف بنجاح")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateExpenseCategorySchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <ExpensesCategoryForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </ExpensesCategoryForm>
    </FormDialog>
  )
}
