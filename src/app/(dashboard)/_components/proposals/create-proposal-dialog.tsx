"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createProposal } from "@/app/_lib/actions/proposal"
import {
  createProposalSchema,
  type CreateProposalSchema,
} from "@/app/_lib/validations"

import { ProposalForm } from "./proposal-form"

export function CreateProposalDialog() {
  const { onClose, isOpen, onOpen } = useFormDialog()

  const form = useForm<CreateProposalSchema>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      name: "",
      proposalExpenseCategories: [
        {
          amount: 0,
          expensesCategoryId: "",
        },
      ],
    },
  })

  const { executeAsync, isExecuting } = useAction(createProposal, {
    onSuccess: () => {
      toast.success("تم إنشاء الدراسة")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateProposalSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <ProposalForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </ProposalForm>
    </FormDialog>
  )
}
