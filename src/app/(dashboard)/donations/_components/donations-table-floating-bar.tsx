import * as React from "react"
import {
  donations,
  type Donation,
  type DonationWithRelations,
} from "@/db/schemas"
import { DownloadIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons"
import { SelectTrigger } from "@radix-ui/react-select"
import { type Table } from "@tanstack/react-table"
import { CircleDollarSign } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FloatingTooltip } from "@/app/_components/table/floating-tooltip"
import TableFloatingBar from "@/app/_components/table/table-floating-bar"
import {
  deleteDonations,
  updateDonationsPayment,
} from "@/app/_lib/actions/donation"
import { donationPaymentTranslation } from "@/app/_lib/translate"
import { FloatingSelect } from "@/app/_components/table/floating-select"

interface TasksTableFloatingBarProps {
  table: Table<DonationWithRelations>
}

export function DonationsTableFloatingBar({
  table,
}: TasksTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const [isPending, startTransition] = React.useTransition()
  const [method, setMethod] = React.useState<
    "update-paymentType" | "update-priority" | "export" | "delete"
  >()

  const { executeAsync, isExecuting } = useAction(deleteDonations, {
    onSuccess: () => {
      table.toggleAllRowsSelected(false)
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onDelete() {
    setMethod("delete")
    await executeAsync({
      ids: rows.map((row) => row.original.fundTransactionId),
    })
  }

  const {
    executeAsync: updateExecuteAsync,
    isExecuting: updateDonationExecuting,
  } = useAction(updateDonationsPayment, {
    onSuccess: () => {
      toast.success("تم التحديث بنجاح")
      table.toggleAllRowsSelected(false)
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function updatePaymentType(value: Donation["paymentType"]) {
    setMethod("update-paymentType")
    await updateExecuteAsync({
      ids: rows.map((row) => row.original.fundTransactionId),
      paymentType: value,
    })
  }

  return (
    <TableFloatingBar table={table}>

    <FloatingSelect
      icon={CircleDollarSign}
      isLoading={updateDonationExecuting}
      text="تحديث الدفع"
      onValueChange={(value: Donation["paymentType"]) =>
        updatePaymentType(value)
      }
      options={donations.paymentType.enumValues.map((status) => ({
        label: donationPaymentTranslation[status],
        value: status,
      }))}

    />


{/* 
      <Select
        onValueChange={(value: Donation["paymentType"]) =>
          updatePaymentType(value)
        }
      >

        <Tooltip delayDuration={250}>
          <SelectTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                disabled={updateDonationExecuting}
              >
                {updateDonationExecuting && method === "update-paymentType" ? (
                  <ReloadIcon
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <CircleDollarSign className="size-3.5" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
          </SelectTrigger>
          <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
            <p>تحديث الدفع</p>
          </TooltipContent>
        </Tooltip>
        <SelectContent align="center">
          <SelectGroup>
            {donations.paymentType.enumValues.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {donationPaymentTranslation[status]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select> */}

      <FloatingTooltip
        icon={TrashIcon}
        isLoading={isExecuting}
        text="حذف"
        onClick={onDelete}
      />
    </TableFloatingBar>
  )
}
