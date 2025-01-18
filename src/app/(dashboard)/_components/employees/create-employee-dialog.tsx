"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createEmployee } from "@/app/_lib/actions/employee"
import {
  createEmployeeSchema,
  type CreateEmployeeSchema,
} from "@/app/_lib/validations"

import { EmployeeForm } from "./employee-form"

export function CreateEmployeeDialog() {
  const { onClose, isOpen, onOpen } = useFormDialog()

  const queryClient = useQueryClient()

  const form = useForm<CreateEmployeeSchema>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      status: "active",
      name: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createEmployee, {
    onSuccess: async () => {
      toast.success("تم إنشاء الموظف")
      await queryClient.invalidateQueries({
        queryKey: ["employees"],
      })
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateEmployeeSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <EmployeeForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </EmployeeForm>
    </FormDialog>
  )
}
