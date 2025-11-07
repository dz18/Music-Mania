'use client'

import Footer from "./components/ui/Footer";
import Nav from "./components/ui/NavigationBar";
import Welcome from "./components/root/Welcome";

export default function Index () {
  return (
    <div>
      <Nav/>
      <Welcome/>
      <Footer/>
    </div>
  )
}