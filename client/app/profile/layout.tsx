import Container from '@/app/components/ui/Container'
import Footer from '@/app/components/ui/Footer'
import Nav from '@/app/components/ui/NavigationBar'
import { ReactNode } from 'react'
export const dynamic = 'force-dynamic'

interface ProfileLayoutProps {
  children: ReactNode
}
export default function ProfileLayout({ children }: ProfileLayoutProps) {
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