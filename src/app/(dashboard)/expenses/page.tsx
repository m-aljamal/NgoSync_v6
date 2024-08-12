import { type SearchParams } from "@/types"

import Heading from "@/components/Heading"
import { searchParamsSchema } from "@/app/_lib/validations"

export interface IndexPageProps {
  searchParams: SearchParams
}
export default function Expenses({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  return (
    <div>
      <Heading
        title="المصاريف"
        description="المصاريف المالية للمنظمة"
        icon="Redo"
      />
    </div>
  )
}
