"use client"

import dynamic from "next/dynamic"
import { useMountedState } from "react-use"

import { useViewMoreDialog } from "@/hooks/use-view-data-dialog"
import ViewMoreDrawer from "@/app/_components/view-more/view-more-drawer"

const ViewMoreDonation = dynamic(
  () => import("@/app/(dashboard)/donations/_components/view-more-donation")
)
const ViewMoreDoner = dynamic(
  () => import("@/app/(dashboard)/doners/_components/view-more-doner")
)

export const SheetProvider = () => {
  const isMounted = useMountedState()
  const { table } = useViewMoreDialog()

  if (!isMounted) return null

  const renderComponent = () => {
    switch (table) {
      case "donation":
        return <ViewMoreDonation />
      case "doner":
        return <ViewMoreDoner />
      default:
        return null
    }
  }

  return <ViewMoreDrawer>{renderComponent()}</ViewMoreDrawer>
}
