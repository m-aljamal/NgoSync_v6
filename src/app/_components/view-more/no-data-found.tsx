import React from "react"
import { InfoCircledIcon } from "@radix-ui/react-icons"

export default function NoDataFound() {
  return (
    <div className="mt-20 flex items-center justify-center text-sm">
      لا يوجد بيانات
      <InfoCircledIcon className="mr-2 size-4" />
    </div>
  )
}
