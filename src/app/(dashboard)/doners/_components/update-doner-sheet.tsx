"use client"

import * as React from "react"
import { type Doner } from "@/db/schemas/donation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateDoner } from "@/app/_lib/actions/doner"
import {
  createDonerSchema,
  type CreateDonerSchema,
} from "@/app/_lib/validations"

import { DonerForm } from "./doner-form"

interface UpdateDonerSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  doner: Doner
}

export function UpdateDonerSheet({ doner, ...props }: UpdateDonerSheetProps) {
  const form = useForm<CreateDonerSchema>({
    resolver: zodResolver(createDonerSchema),
    defaultValues: {},
  })

  React.useEffect(() => {
    form.reset({
      id: doner.id,
      name: doner.name,
      gender: doner.gender,
      email: doner.email ?? "",
      phone: doner.phone ?? "",
      type: doner.type,
      description: doner.description ?? "",
      address: doner.address ?? "",
      status: doner.status,
    })
  }, [doner, form])

  const { executeAsync, isExecuting } = useAction(updateDoner, {
    onSuccess: () => {
      toast.success("تم تعديل المتبرع")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل المتبرع")
    },
  })

  async function onSubmit(input: CreateDonerSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <DonerForm form={form} onSubmit={onSubmit} isUpdate>
        <UpdateButtons isExecuting={isExecuting} />
      </DonerForm>
    </UpdateSheet>
  )
}
