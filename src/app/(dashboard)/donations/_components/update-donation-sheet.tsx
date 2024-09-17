"use client"

import * as React from "react"
import { type DonationWithRelations } from "@/db/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateDonation } from "@/app/_lib/actions/donation"
import {
  createDonationSchema,
  type CreateDonationSchema,
} from "@/app/_lib/validations"

import { DonationForm } from "./donation-form"

interface UpdateDonationSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  donation: DonationWithRelations
}

export function UpdateDonationSheet({
  donation,
  ...props
}: UpdateDonationSheetProps) {
  const defaultValues: CreateDonationSchema = React.useMemo(() => {
    return {
      date: new Date(donation.date),
      donerId: donation.donerId,
      fundId: donation.fundId,
      amount: new Decimal(donation.amount),
      currencyId: donation.currencyId,
      id: donation.id,
      fundTransactionId: donation.fundTransactionId ?? undefined,
      proposalId: donation.proposalId ?? undefined,
      paymentType: donation.paymentType,
      isOfficial: donation.isOfficial ?? undefined,
      receiptDescription: donation.receiptDescription ?? undefined,
      amountInText: donation.amountInText ?? undefined,
      projectId: donation.projectId ?? undefined,
      description: donation.description ?? undefined,
    }
  }, [donation])

  const form = useForm<CreateDonationSchema>({
    resolver: zodResolver(createDonationSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [donation, form, defaultValues])

  const { executeAsync, isExecuting } = useAction(updateDonation, {
    onSuccess: async () => {
      toast.success("تم تعديل التبرع")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل التبرع")
    },
  })

  async function onSubmit(input: CreateDonationSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <DonationForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </DonationForm>
    </UpdateSheet>
  )
}
