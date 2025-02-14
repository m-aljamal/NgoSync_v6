"use client"

import dynamic from "next/dynamic"
import { useMountedState } from "react-use"

import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import { ViewMoreDrawer } from "@/components/view-more"

const ViewMoreDonation = dynamic(
  () => import("@/app/(dashboard)/_components/donations/view-more-donation")
)

const ViewMoreExpenses = dynamic(
  () => import("@/app/(dashboard)/_components/expenses/view-more-expenses")
)

export const SheetProvider = () => {
  const isMounted = useMountedState()
  const { table } = useViewMoreDialog()

  if (!isMounted) return null

  const renderComponent = () => {
    switch (table) {
      case "donation":
        return <ViewMoreDonation />
      case "expenses":
        return <ViewMoreExpenses />
      default:
        return null
    }
  }

  return <ViewMoreDrawer>{renderComponent()}</ViewMoreDrawer>
}
