"use client"

import * as React from "react"
import { type Proposal } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/update-buttons"
import { UpdateSheet } from "@/components/update-sheet"
import { updateProposal } from "@/app/_lib/actions/proposal"
import {
  createProposalSchema,
  type CreateProposalSchema,
} from "@/app/_lib/validations"

import { ProposalForm } from "./proposal-form"

interface UpdateProposalSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  proposal: Proposal
}

export function UpdateProposalSheet({
  proposal,
  ...props
}: UpdateProposalSheetProps) {
  const form = useForm<CreateProposalSchema>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {},
  })

  React.useEffect(() => {
    form.reset({
      id: proposal.id,
      name: proposal.name,
      projectId: proposal.projectId,
    })
  }, [proposal, form])

  const { executeAsync, isExecuting } = useAction(updateProposal, {
    onSuccess: () => {
      toast.success("تم تعديل الدراسة")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الدراسة")
    },
  })

  async function onSubmit(input: CreateProposalSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <ProposalForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </ProposalForm>
    </UpdateSheet>
  )
}
