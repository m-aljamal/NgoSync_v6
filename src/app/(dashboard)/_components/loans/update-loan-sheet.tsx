"use client"

import * as React from "react"
import { type LoanWithRelations } from "@/db/schemas/loan"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateLoan } from "@/app/_lib/actions/loan"
import { createLoanSchema, type CreateLoanSchema } from "@/app/_lib/validations"

import { LoanForm } from "./loan-form"

interface UpdateLoanSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  loan: LoanWithRelations
}

export function UpdateLoanSheet({ loan, ...props }: UpdateLoanSheetProps) {
  const defaultValues: CreateLoanSchema = React.useMemo(() => {
    return {
      id: loan.id,
      date: new Date(loan.date),
      amount: new Decimal(loan.amount),
      currencyId: loan.currencyId,
      employeeId: loan.employeeId,
      projectId: loan.projectId,
      description: loan.description ?? undefined,
      type: loan.type,
    }
  }, [loan])

  const form = useForm<CreateLoanSchema>({
    resolver: zodResolver(createLoanSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [loan, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(updateLoan, {
    onSuccess: async () => {
      toast.success("تم تعديل القرض")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل القرض")
    },
  })

  async function onSubmit(input: CreateLoanSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <LoanForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </LoanForm>
    </UpdateSheet>
  )
}
