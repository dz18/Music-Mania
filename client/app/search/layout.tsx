
import Container from '@/app/components/ui/Container'
import Footer from '@/app/components/ui/Footer'
import Nav from '@/app/components/ui/NavigationBar'
import { connection } from 'next/server'
import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default async function SearchLayout({ children }: LayoutProps) {

  await connection()

  return (
    <div>
      <Nav />
      <Container>
        <div className="min-h-screen mt-20 mb-10 flex flex-col gap-4">
          {children}
        </div>
      </Container>
      <Footer/>
    </div>
  )
}