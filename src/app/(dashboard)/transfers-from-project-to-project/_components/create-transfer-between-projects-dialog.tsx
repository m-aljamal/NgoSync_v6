"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createTransferBetweenProjects } from "@/app/_lib/actions/transfers"
import {
  createTransferSchema,
  type CreateTransferSchema,
} from "@/app/_lib/validations"

import { TransferBetweenProjectsForm } from "./transfer-between-projects-form"

// todo fix the date and fix the dissplay the tranfer to the project
// todo الخصم المباشر من الصناديق
//  todo الوصلات
// todo اجور حوالات مباشر من الحولات
// todo الصفحة الرئيسية

export function CreateTransferBetweenProjectsDialog() {
  const { onClose } = useFormDialog()

  const form = useForm<CreateTransferSchema>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      description: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(
    createTransferBetweenProjects,
    {
      onSuccess: () => {
        toast.success("تم إنشاء الحوالة")
        form.reset()
        toast.dismiss()
        onClose()
      },
      onError: ({ error }) => {
        toast.error(error.serverError)
      },
    }
  )

  async function onSubmit(input: CreateTransferSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <TransferBetweenProjectsForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </TransferBetweenProjectsForm>
    </FormDialog>
  )
}
