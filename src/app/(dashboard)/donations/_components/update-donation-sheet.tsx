"use client"

import * as React from "react"
import { Donation } from "@/db/schemas"
import { type Proposal } from "@/db/schemas/proposal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useGetProposalExpensesCategories } from "@/hooks/use-get-form-data"
import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateProposal } from "@/app/_lib/actions/proposal"
import {
  createDonationSchema,
  CreateDonationSchema,
  createProposalSchema,
  type CreateProposalSchema,
} from "@/app/_lib/validations"

interface UpdateDonationSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  donation: Donation
}

export function UpdateDonationSheet({
  donation,
  ...props
}: UpdateDonationSheetProps) {
  const queryClient = useQueryClient()
  const { data } = useGetProposalExpensesCategories(donation.id)

  // const defaultValues: CreateDonationSchema = React.useMemo(() => {
  //   return {
  //     id: proposal.id,
  //     name: proposal.name,
  //     projectId: proposal.projectId,
  //     amount: proposal.amount,
  //     currencyId: proposal.currencyId,
  //     proposalExpenseCategories,
  //   }
  // }, [proposal, proposalExpenseCategories])

  const form = useForm<CreateDonationSchema>({
    resolver: zodResolver(createDonationSchema),
    // defaultValues,
  })

  // React.useEffect(() => {
  //   form.reset(defaultValues)
  // }, [proposal, form, defaultValues, proposalExpenseCategories])

  // const { executeAsync, isExecuting } = useAction(updateProposal, {
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({
  //       queryKey: ["proposalExpensesCategories"],
  //     })
  //     toast.success("تم تعديل التبرع")
  //     props.onOpenChange?.(false)
  //     form.reset()
  //   },
  //   onError: ({ error }) => {
  //     toast.error(error.serverError)
  //   },
  //   onExecute: () => {
  //     toast.loading("جاري تعديل التبرع")
  //   },
  // })

  // async function onSubmit(input: CreateDonationSchema) {
  //   await executeAsync(input)
  //   toast.dismiss()
  // }
  return (
    <UpdateSheet {...props}>
      <div>fdf</div>
      {/* <ProposalForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </ProposalForm> */}
    </UpdateSheet>
  )
}
