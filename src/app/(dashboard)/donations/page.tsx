import { type SearchParams } from "@/types"

import Heading from "@/components/Heading"
import { searchParamsSchema } from "@/app/_lib/validations"

export interface IndexPageProps {
  searchParams: SearchParams
}

export default function Donation({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  return (
    <div>
      <Heading
        title="التبرعات"
        description="التبرعات المالية"
        icon="Presentation"
      />
    </div>
  )
}
