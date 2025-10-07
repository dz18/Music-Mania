'use client'

import { useSearchParams } from "next/navigation"
import { use } from "react"

export default function Search ({
  params
} : {
  params: Promise<{type: string}>
}) {

  const { type } = use(params)
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const offset = searchParams.get('offset') ?? ''

  return (
    <div>

    </div>
  )
}