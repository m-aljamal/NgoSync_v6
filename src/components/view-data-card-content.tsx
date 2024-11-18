import React from "react"
import { type LucideIcon } from "lucide-react"

type ViewDataCardContentProps = {
  content: {
    label: string | number | LucideIcon | React.ReactNode
    value: string | number | React.ReactNode
  }[]
}

export default function ViewDataCardContent({
  content = [],
}: ViewDataCardContentProps) {
  return (
    <div className="mt-6 border-t border-gray-100">
      <dl className="divide-y divide-gray-100">
        {content.map((item, index) => (
          <div
            className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            key={index}
          >
            <dt className="text-sm font-medium leading-6 text-gray-900">
              {typeof item.label === "string" ||
              typeof item.label === "number" ? (
                item.label
              ) : typeof item.label === "function" ? (
                <item.label className="size-5" />
              ) : (
                item.label
              )}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
