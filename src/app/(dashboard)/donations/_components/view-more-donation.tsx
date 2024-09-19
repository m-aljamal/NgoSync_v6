import React from "react"

import { formatCurrency } from "@/lib/utils"
import { useGetDonationById } from "@/hooks/queries/use-get-donation"
import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ViewMoreDonation() {
  const { id } = useViewMoreDialog()
  const { data, isLoading } = useGetDonationById(id)
  if (isLoading) return <div>loading...</div>
  if (!data) return <div>no data</div>
  return (
    <div className="px-8">
      <div className="grid grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المبلغ</CardTitle>

            <span className="font-bold text-muted-foreground">
              {data.currencies.code}
            </span>
          </CardHeader>
          <CardContent>
            {formatCurrency(data.donations.amount, data.currencies.code)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
