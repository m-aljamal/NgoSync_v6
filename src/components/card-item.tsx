import { formatDate } from "date-fns"

import { icons } from "./layouts/icons"

export type CardItemProps = {
  title: string
  icon: keyof typeof icons
  description: string | number | Date | null | undefined
}

export function CardItem({ title, icon, description }: CardItemProps) {
  const Icon = icons[icon]

  const formattedDescription = (desc: CardItemProps["description"]): string => {
    if (desc instanceof Date) {
      return formatDate(desc, "yyyy-MM-dd")
    }
    return desc?.toString() || ""
  }

  return (
    <div className="border-t border-gray-100">
      <dl className="divide-y divide-gray-100 py-3">
        <div className="px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="flex gap-2 text-sm font-medium leading-6 text-gray-900">
            <Icon className="size-5" />
            {title}
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {formattedDescription(description)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
