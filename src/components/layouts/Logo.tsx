import React from "react"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="ml-4 hidden items-center lg:flex">
      <h2 className="text-lg font-bold">NgoSync</h2>
    </Link>
  )
}
