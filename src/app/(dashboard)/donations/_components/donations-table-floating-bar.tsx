import {
  donations,
  type Donation,
  type DonationWithRelations,
} from "@/db/schemas"
import { TrashIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { CircleDollarSign } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { FloatingSelect } from "@/components/data-table/floating-select"
import { FloatingTooltip } from "@/components/data-table/floating-tooltip"
import TableFloatingBar from "@/components/data-table/table-floating-bar"
import {
  deleteDonations,
  updateDonationsPayment,
} from "@/app/_lib/actions/donation"
import { donationPaymentTranslation } from "@/app/_lib/translate"

interface TasksTableFloatingBarProps {
  table: Table<DonationWithRelations>
}

export function DonationsTableFloatingBar({
  table,
}: TasksTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const { executeAsync, isExecuting } = useAction(deleteDonations, {
    onSuccess: () => {
      table.toggleAllRowsSelected(false)
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  async function onDelete() {
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
        onValueChange={updatePaymentType}
        options={donations.paymentType.enumValues.map((status) => ({
          label: donationPaymentTranslation[status],
          value: status,
        }))}
      />

      <FloatingTooltip
        icon={TrashIcon}
        isLoading={isExecuting}
        text="حذف"
        onClick={onDelete}
      />
    </TableFloatingBar>
  )
}
