"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createDoner } from "@/app/_lib/actions/doner"
import {
  createDonerSchema,
  type CreateDonerSchema,
} from "@/app/_lib/validations"

import { DonerForm } from "./doner-form"

export function CreateDonerDialog() {
  const { onClose } = useFormDialog()

  const form = useForm<CreateDonerSchema>({
    resolver: zodResolver(createDonerSchema),
    defaultValues: {
      status: "active",
      name: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createDoner, {
    onSuccess: () => {
      toast.success("تم إنشاء المتبرع")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateDonerSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <DonerForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </DonerForm>
    </FormDialog>
  )
}
