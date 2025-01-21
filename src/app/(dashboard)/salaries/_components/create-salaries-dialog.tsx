"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import { useGetEmployees } from "@/hooks/use-get-form-data"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createSalaries } from "@/app/_lib/actions/employee"
import {
  createSalariesSchema,
  type CreateSalariesSchema,
} from "@/app/_lib/validations"

import { SalariesForm } from "./salaries-form"
import React from "react"

export function CreateSalariesDialog() {
  const { isOpen, onOpen, onClose } = useFormDialog()

  const form = useForm<CreateSalariesSchema>({
    resolver: zodResolver(createSalariesSchema),
    defaultValues: {
      salaries: [],
    },
  })
  const selectedProject = form.watch("projectId")

  const { data: employees, isLoading: employeesLoading } =
    useGetEmployees(selectedProject)

  const { executeAsync, isExecuting } = useAction(createSalaries, {
    onSuccess: () => {
      toast.success("تم ادخال الرواتب")
      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  const defulatValues: CreateSalariesSchema = React.useMemo(()=>{
    return{
      salaries: employees?.map((employee)=>({
        employeeName: employee.name,

      }))
    }
  },[employees])


  async function onSubmit(input: CreateSalariesSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <SalariesForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </SalariesForm>
    </FormDialog>
  )
}
