"use client"

import * as React from "react"
import { type Doner } from "@/db/schemas/donation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import { UpdateButtons, UpdateSheet } from "@/components/form-components"
import { updateDoner } from "@/app/_lib/actions/doner"
import {
  createDonerSchema,
  type CreateDonerSchema,
} from "@/app/_lib/validations"

import { DonerForm } from "./doner-form"
import { useQueryClient } from "@tanstack/react-query"

interface UpdateDonerSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  doner: Doner
}

export function UpdateDonerSheet({ doner, ...props }: UpdateDonerSheetProps) {
  const defaultValues: CreateDonerSchema = React.useMemo(() => {
    return {
      name: doner.name,
      gender: doner.gender,
      phone: doner.phone ?? "",
      email: doner.email ?? "",
      address: doner.address ?? "",
      type: doner.type,
      status: doner.status,
      description: doner.description ?? "",
      id: doner.id,
    }
  }, [doner])

  const form = useForm<CreateDonerSchema>({
    resolver: zodResolver(createDonerSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [doner, form, defaultValues])

  const queryClient = useQueryClient()


  const { executeAsync, isExecuting } = useAction(updateDoner, {
    onSuccess: async () => {
      toast.success("تم تعديل المتبرع")
      props.onOpenChange?.(false)
      await queryClient.invalidateQueries({
        queryKey: ["doners"]
      })
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
      <DonerForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </DonerForm>
    </UpdateSheet>
  )
}
