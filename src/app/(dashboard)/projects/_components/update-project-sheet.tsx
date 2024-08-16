"use client"

import * as React from "react"
import { type Project } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { updateProject } from "@/app/_lib/actions/project"
import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/app/_lib/validations"

import { ProjectForm } from "./project-form"

interface UpdateProjectSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  project: Project
}

export function UpdateProjectSheet({
  project,
  ...props
}: UpdateProjectSheetProps) {
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project.name,
      nameTr: project.nameTr ?? "",
      status: project.status,
      system: project.system,
      userId: project.userId,
      id: project.id,
    },
  })

  React.useEffect(() => {
    form.reset({
      id: project.id,
      name: project.name,
      nameTr: project.nameTr ?? "",
      status: project.status,
      system: project.system,
      userId: project.userId,
    })
  }, [project, form])

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

  async function onSubmit(input: CreateProjectSchema) {
    await executeAsync(input)
    form.reset()
    toast.dismiss()
    props.onOpenChange?.(false)
  }
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-right">
          <SheetTitle>تعديل مشروع</SheetTitle>
          <SheetDescription>
            عدل معلومات المشروع واحفظ التغييرات
          </SheetDescription>
        </SheetHeader>
        <ProjectForm form={form} onSubmit={onSubmit} isUpdate>
          <SheetFooter className="gap-2 pt-2">
            <Button disabled={isExecuting}>
              {isExecuting && (
                <ReloadIcon
                  className="ml-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              تعديل
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                إلغاء
              </Button>
            </SheetClose>
          </SheetFooter>
        </ProjectForm>
      </SheetContent>
    </Sheet>
  )
}
