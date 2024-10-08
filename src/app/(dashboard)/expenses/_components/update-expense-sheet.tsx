"use client"

import * as React from "react"
import { type ProjectTransaction } from "@/db/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateExpense } from "@/app/_lib/actions/project-transaction"
import {
  createExpenseSchema,
  type CreateExpenseSchema,
} from "@/app/_lib/validations"

import { ExpenseForm } from "./expense-form"

interface UpdateExpenseSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  expense: ProjectTransaction
}

export function UpdateExpenseSheet({
  expense,
  ...props
}: UpdateExpenseSheetProps) {
  const defaultValues: CreateExpenseSchema = React.useMemo(() => {
    return {
      date: new Date(expense.date),
      projectId: expense.projectId,
      currencyId: expense.currencyId,
      amount: new Decimal(expense.amount),
      description: expense.description ?? "",
      isOfficial: expense.isOfficial,
      expensesCategoryId: expense.expensesCategoryId ?? "",
      proposalId: expense.proposalId,
      id: expense.id,
    }
  }, [expense])

  const form = useForm<CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [expense, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(updateExpense, {
    onSuccess: async () => {
      toast.success("تم تعديل المصروف")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل المصروف")
    },
  })

  async function onSubmit(input: CreateExpenseSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  
  return (
    <UpdateSheet {...props}>
      <ExpenseForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </ExpenseForm>
    </UpdateSheet>
  )
}
