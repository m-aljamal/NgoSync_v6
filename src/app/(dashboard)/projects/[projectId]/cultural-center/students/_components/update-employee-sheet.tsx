"use client"

import * as React from "react"
import { type Employee } from "@/db/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateEmployee } from "@/app/_lib/actions/employee"
import {
  createEmployeeSchema,
  type CreateEmployeeSchema,
} from "@/app/_lib/validations"

import { EmployeeForm } from "./student-form"

interface UpdateEmployeeSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  employee: Employee
}

export function UpdateEmployeeSheet({
  employee,
  ...props
}: UpdateEmployeeSheetProps) {
  const form = useForm<CreateEmployeeSchema>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {},
  })

  React.useEffect(() => {
    form.reset({
      id: employee.id,
      name: employee.name,
      gender: employee.gender,
      email: employee.email ?? "",
      phone: employee.phone ?? "",
      projectId: employee.projectId,
      position: employee.position ?? "",
      salary: employee.salary ?? 0,
      currencyId: employee.currencyId ?? "",
      birthDate: employee.birthDate ?? new Date(),
      jobTitleId: employee.jobTitleId,
      description: employee.description ?? "",
      address: employee.address ?? "",
      status: employee.status,
    })
  }, [employee, form])

  const { executeAsync, isExecuting } = useAction(updateEmployee, {
    onSuccess: () => {
      toast.success("تم تعديل الموظف")
      props.onOpenChange?.(false)
      form.reset()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل الموظف")
    },
  })

  async function onSubmit(input: CreateEmployeeSchema) {
    await executeAsync(input)
    toast.dismiss()
  }
  return (
    <UpdateSheet {...props}>
      <EmployeeForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </EmployeeForm>
    </UpdateSheet>
  )
}
