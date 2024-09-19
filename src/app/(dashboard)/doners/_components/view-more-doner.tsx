import { useViewMoreDialog } from '@/hooks/use-view-data-dialog'
import React from 'react'

export default function ViewMoreDoner() {
    const {id, table} = useViewMoreDialog()
  
  return (
    <div>view-more drawer {id} {table}</div>
  )
}
