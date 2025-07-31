'use client'

import { usePathname } from "next/navigation"

export default function UnderConstruction () {
  const pathName = usePathname().split('/').filter(Boolean);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      The {pathName} page is under construction 🛠️
    </div>
  )
}