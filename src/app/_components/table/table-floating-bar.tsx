import React from "react"
import { Cross2Icon, DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/kbd"

import { FloatingTooltip } from "./floating-tooltip"

interface TableFloatingBarProps<TData> {
  table: Table<TData>
  children?: React.ReactNode
}

function TableFloatingBar<TData>({
  table,
  children,
}: TableFloatingBarProps<TData>) {
  const rows = table.getFilteredSelectedRowModel().rows

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [table])

  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
          <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
            <span className="whitespace-nowrap text-xs">
              {rows.length} محدد
            </span>
            <Separator orientation="vertical" className="ml-2 mr-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 hover:border"
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <Cross2Icon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                <p className="ml-2">إلغاء التحديد</p>
                <Kbd abbrTitle="Escape" variant="outline">
                  Esc
                </Kbd>
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <div className="flex items-center gap-1.5">
            {children}

            <FloatingTooltip
              onClick={() => {
                startTransition(() => {
                  exportTableToCSV(table, {
                    excludeColumns: ["select", "actions"],
                    onlySelected: true,
                  })
                })
              }}
              isLoading={isPending}
              icon={DownloadIcon}
              text="تصدير"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableFloatingBar
