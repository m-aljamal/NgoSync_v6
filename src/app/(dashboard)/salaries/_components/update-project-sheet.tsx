"use client"

import * as React from "react"
import { SalaryPayment } from "@/db/schemas"
import { type Project } from "@/db/schemas/project"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { type Sheet } from "@/components/ui/sheet"
import UpdateButtons from "@/components/form-components/update-buttons"
import { UpdateSheet } from "@/components/form-components/update-sheet"
import { updateProject } from "@/app/_lib/actions/project"
import {
  createProjectSchema,
  CreateSalariesSchema,
  type CreateProjectSchema,
} from "@/app/_lib/validations"

import { SalariesForm } from "./salaries-form"

interface UpdateProjectSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  salaries: SalaryPayment
}

export function UpdateProjectSheet({
  salaries,
  ...props
}: UpdateProjectSheetProps) {
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {},
  })

  // React.useEffect(() => {
  //   form.reset({
  //     id: project.id,
  //     name: project.name,
  //     nameTr: project.nameTr ?? "",
  //     status: project.status,
  //     system: project.system,
  //     userId: project.userId,
  //   })
  // }, [project, form])

  const { executeAsync, isExecuting } = useAction(updateProject, {
    onSuccess: () => {
      toast.success("تم تعديل المشروع")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري تعديل المشروع")
    },
  })

  async function onSubmit(input: CreateSalariesSchema) {
    await executeAsync(input)
    form.reset()
    toast.dismiss()
    props.onOpenChange?.(false)
  }
  return (
    <UpdateSheet {...props}>
      <SalariesForm form={form} onSubmit={onSubmit}>
        <UpdateButtons isExecuting={isExecuting} />
      </SalariesForm>
    </UpdateSheet>
  )
}
