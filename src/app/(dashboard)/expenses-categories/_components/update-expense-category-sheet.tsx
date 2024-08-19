"use client"

import * as React from "react"
import { type ExpensesCategory } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/update-buttons"
import { UpdateSheet } from "@/components/update-sheet"
import { updateExpenseCategory } from "@/app/_lib/actions/project-transaction"
import {
  createExpenseCategorySchema,
  type CreateExpenseCategorySchema,
} from "@/app/_lib/validations"

import { ExpensesCategoryForm } from "./expense-category-form"

interface UpdateExpenseCategorySheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  expenseCategory: ExpensesCategory
}

export function UpdateExpenseCategorySheet({
  expenseCategory,
  ...props
}: UpdateExpenseCategorySheetProps) {
  const form = useForm<CreateExpenseCategorySchema>({
    resolver: zodResolver(createExpenseCategorySchema),
    defaultValues: {
      name: expenseCategory.name,
      projectId: expenseCategory.projectId,
      id: expenseCategory.id,
    },
  })

  React.useEffect(() => {
    form.reset({
      name: expenseCategory.name,
      projectId: expenseCategory.projectId,
      id: expenseCategory.id,
    })
  }, [expenseCategory, form])

  const { executeAsync, isExecuting } = useAction(updateExpenseCategory, {
    onSuccess: () => {
      toast.success("تم تعديل الفئة")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الفئة")
    },
  })

  async function onSubmit(input: CreateExpenseCategorySchema) {
    await executeAsync(input)
    form.reset()
    toast.dismiss()
    props.onOpenChange?.(false)
  }
  return (
    <UpdateSheet {...props}>
      <ExpensesCategoryForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </ExpensesCategoryForm>
    </UpdateSheet>
  )
}
