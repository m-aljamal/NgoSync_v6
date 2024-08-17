import { searchParamsSchema } from '@/app/_lib/validations'
import { type SearchParams } from '@/types'
import React from 'react'

export default function Doners({searchParams}:SearchParams) {
    const search = searchParamsSchema.parse(searchParams)

  return (
    <div>page</div>
  )
}
