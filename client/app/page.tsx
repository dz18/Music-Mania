'use client'

import Footer from "./components/ui/Footer";
const Nav = dynamic(
  () => import('./components/ui/NavigationBar'),
  { ssr: false }
)
import Welcome from "./components/root/Welcome";
import dynamic from "next/dynamic";

export default function Index () {
  return (
    <div>
      <Nav/>
      <Welcome/>
      <Footer/>
    </div>
  )
}