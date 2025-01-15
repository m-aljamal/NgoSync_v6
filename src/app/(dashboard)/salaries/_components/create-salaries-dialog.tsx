"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createSalaries } from "@/app/_lib/actions/employee"
import {
  createSalariesSchema,
  type CreateSalariesSchema,
} from "@/app/_lib/validations"

import { SalariesForm } from "./salaries-form"
import { useGetEmployees } from "@/hooks/use-get-form-data"

export function CreateSalariesDialog() {
  const { onClose } = useFormDialog()

  const form = useForm<CreateSalariesSchema>({
    resolver: zodResolver(createSalariesSchema),
    defaultValues: {
      salaries:[
        
      ]
    },
  })

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

  async function onSubmit(input: CreateSalariesSchema) {
    await executeAsync(input)
  }

  const selectedProject = form.watch("projectId")

  const { data: employees, isLoading: employeesLoading } =
    useGetEmployees(selectedProject)

    console.log({selectedProject, employees});
    

  return (
    <FormDialog>
      <SalariesForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </SalariesForm>
    </FormDialog>
  )
}
