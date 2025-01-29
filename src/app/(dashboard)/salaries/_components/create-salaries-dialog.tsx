"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
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

export function CreateSalariesDialog() {
  const { onClose } = useFormDialog()

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

  React.useEffect(() => {
    if (employees) {
      const defaultSalaries = employees.map((employee) => ({
        employeeName: employee.name,
        employeeId: employee.id,
        salary: new Decimal(employee.salary || 0),
        currencyId: employee.currencyId ?? "",
        netSalary: new Decimal(employee.salary || 0),
        description: "",
        paymentCurrencyId: employee.currencyId ?? "",
      }))

      form.setValue("salaries", defaultSalaries)
    }
  }, [employees, form])

  async function onSubmit(input: CreateSalariesSchema) {
    await executeAsync(input)
  }

  return (
    <FormDialog>
      <SalariesForm
        form={form}
        onSubmit={onSubmit}
        isLoading={employeesLoading}
      >
        <FormButtons isExecuting={isExecuting} />
      </SalariesForm>
    </FormDialog>
  )
}
