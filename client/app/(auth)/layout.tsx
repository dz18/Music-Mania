import Container from '@/app/components/ui/Container'
import Footer from '@/app/components/ui/Footer'
import Nav from '@/app/components/ui/NavigationBar'
import React, { ReactNode } from 'react'

export default function ProfileLayout(
  { children }: {children : ReactNode}
) {
  return (
    <div>
      <Container>
        {children}
      </Container>
    </div>
  )
}