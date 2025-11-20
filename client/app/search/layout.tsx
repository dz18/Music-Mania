
import Container from '@/app/components/ui/Container'
import Footer from '@/app/components/ui/Footer'
import Nav from '@/app/components/ui/NavigationBar'
import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function SearchLayout({ children }: LayoutProps) {
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