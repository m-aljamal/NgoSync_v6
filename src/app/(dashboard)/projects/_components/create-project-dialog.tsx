"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import FormButtons from "@/components/form-components/form-buttons"
import FormDialog from "@/components/form-components/form-dialog"
import { createProject } from "@/app/_lib/actions/project"
import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/app/_lib/validations"

import { ProjectForm } from "./project-form"

export function CreateProjectDialog() {
  const { onClose } = useFormDialog()
  const queryClient = useQueryClient()
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      status: "in-progress",
      name: "",
      nameTr: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createProject, {
    onSuccess: () => {
      toast.success("تم إنشاء المشروع")

      form.reset()
      toast.dismiss()
      onClose()
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onSubmit(input: CreateProjectSchema) {
    await executeAsync(input)
    await queryClient.invalidateQueries({
      queryKey: ["projects"],
    })
  }

  return (
    <FormDialog>
      <ProjectForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </ProjectForm>
    </FormDialog>
  )
}
