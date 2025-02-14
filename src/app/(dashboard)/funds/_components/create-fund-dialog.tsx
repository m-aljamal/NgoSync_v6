"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createFund } from "@/app/_lib/actions/fund"
import { createFundSchema, type CreateFundSchema } from "@/app/_lib/validations"

import { FundForm } from "./fund-form"

export function CreateFundDialog() {
  const { isOpen, onOpen, onClose } = useFormDialog()
  const queryClient = useQueryClient()

  const form = useForm<CreateFundSchema>({
    resolver: zodResolver(createFundSchema),
    defaultValues: {
      name: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createFund, {
    onSuccess: () => {
      toast.success("تم إنشاء الصندوق")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateFundSchema) {
    await executeAsync(input)
    await queryClient.invalidateQueries({
      queryKey: ["funds"],
    })
  }

  return (
    <FormDialog isOpen={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <FundForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </FundForm>
    </FormDialog>
  )
}
