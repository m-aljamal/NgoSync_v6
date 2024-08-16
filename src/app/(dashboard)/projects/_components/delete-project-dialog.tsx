"use client"

import * as React from "react"
import { type Project } from "@/db/schema"
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

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
import { deleteProjects } from "@/app/_lib/actions/project"

interface DeleteProjectDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  projects: Row<Project>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteProjectsDialog({
  projects,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteProjectDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const { executeAsync, isExecuting } = useAction(deleteProjects, {
    onSuccess: () => {
      toast.success("تم الحذف بنجاح")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
    onExecute: () => {
      toast.loading("جاري الحزف")
    },
  })

  async function onDelete() {
    await executeAsync({ ids: projects.map((p) => p.id) })
    props.onOpenChange?.(false)
    toast.dismiss()
    onSuccess?.()
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <TrashIcon className="ml-2 size-4" aria-hidden="true" />
              حذف ({projects.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>هل متأكد من الحذف؟</DialogTitle>
            <DialogDescription>
              يمكن التراجع عن هذا الإجراء. سيتم حذف بشكل دائم{" "}
              <span className="font-medium">{projects.length}</span>
              {projects.length === 1 ? " عنصر" : " عناصر"} من النظام
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">الغاء</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isExecuting}
            >
              {isExecuting && (
                <ReloadIcon
                  className="ml-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="ml-2 size-4" aria-hidden="true" />
            حذف ({projects.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> هل متأكد من الحذف؟</DrawerTitle>
          <DrawerDescription>
            يمكن التراجع عن هذا الإجراء. سيتم حذف بشكل دائم{" "}
            <span className="font-medium">{projects.length}</span>
            {projects.length === 1 ? " عنصر" : " عناصر"} من النظام
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">الفاء</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isExecuting}
          >
            {isExecuting && (
              <ReloadIcon
                className="ml-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            حذف
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
