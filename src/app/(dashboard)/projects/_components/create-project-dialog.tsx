"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFormDialog } from "@/hooks/use-form-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { createProject } from "@/app/_lib/actions/project"
import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/app/_lib/validations"

import FormButtons from "./form-buttons"
import FormDialog from "./form-dialog"
import { ProjectForm } from "./project-form"

export function CreateProjectDialog() {
  const [open, setOpen] = React.useState(false)
  const { onClose } = useFormDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")

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
  }

  return (
    <FormDialog>
      <ProjectForm form={form} onSubmit={onSubmit}>
        <FormButtons isExecuting={isExecuting} />
      </ProjectForm>
    </FormDialog>
  )

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <PlusIcon className="ml-2 size-4" aria-hidden="true" />
            إضافة
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مشروع</DialogTitle>
            <DialogDescription>
              قم بملء التفاصيل أدناه لإنشاء مشروع جديد.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm form={form} onSubmit={onSubmit}>
            <DialogFooter className="gap-2 pt-2">
              <Button disabled={isExecuting}>
                {isExecuting && (
                  <ReloadIcon
                    className="ml-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                إنشاء
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
            </DialogFooter>
          </ProjectForm>
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="ml-2 size-4" aria-hidden="true" />
          اضافة
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>إضافة مشروع</DrawerTitle>
          <DrawerDescription>
            قم بملء التفاصيل أدناه لإنشاء مشروع جديد.
          </DrawerDescription>
        </DrawerHeader>
        <ProjectForm form={form} onSubmit={onSubmit}>
          <DrawerFooter className="gap-2 sm:gap-0">
            <DrawerClose asChild>
              <Button variant="outline"> إلغاء</Button>
            </DrawerClose>
            <Button disabled={isExecuting}>
              {isExecuting && (
                <ReloadIcon
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              إنشاء
            </Button>
          </DrawerFooter>
        </ProjectForm>
      </DrawerContent>
    </Drawer>
  )
}
