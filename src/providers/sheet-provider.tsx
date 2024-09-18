"use client"

import { useMountedState } from "react-use"

import ShowData from "@/components/show-data"

export const SheetProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <ShowData />
    </>
  )
}
