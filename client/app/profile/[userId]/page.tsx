'use client'

import Footer from "@/app/components/ui/Footer"
import Nav from "@/app/components/ui/NavigationBar"
import UnderConstruction from "@/app/lib/fallback/UnderConstruction"
import { use } from "react"


export default function Profile ({
  params
} : {
  params: Promise<{userId: string}>
}) {

  const { userId } = use(params)

  return (
    <div>
      <Nav/>
      <UnderConstruction/>
      {userId}
      <Footer/>
    </div>
  )
}