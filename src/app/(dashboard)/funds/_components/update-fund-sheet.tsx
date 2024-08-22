"use client"

import * as React from "react"
import { type Fund } from "@/db/schemas/fund"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateFund } from "@/app/_lib/actions/fund"
import { createFundSchema, type CreateFundSchema } from "@/app/_lib/validations"

import { FundForm } from "./fund-form"

interface UpdateFundSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  fund: Fund
}

export function UpdateFundSheet({ fund, ...props }: UpdateFundSheetProps) {
  const form = useForm<CreateFundSchema>({
    resolver: zodResolver(createFundSchema),
    defaultValues: {
      name: fund.name,
      id: fund.id,
    },
  })

  React.useEffect(() => {
    form.reset({
      id: fund.id,
      name: fund.name,
    })
  }, [fund, form])

  const { executeAsync, isExecuting } = useAction(updateFund, {
    onSuccess: () => {
      toast.success("تم تعديل الصندوق")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الصندوق")
    },
  })

  async function onSubmit(input: CreateFundSchema) {
    await executeAsync(input)
    form.reset()
    toast.dismiss()
    props.onOpenChange?.(false)
  }
  return (
    <UpdateSheet {...props}>
      <FundForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </FundForm>
    </UpdateSheet>
  )
}
