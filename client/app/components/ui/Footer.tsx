'use client'

import StatusLink from "./footer/StatusLink"
import Container from "./Container"
import Link from "next/link"
import { FormEvent, useState } from "react"

export default function Footer () {

  const [email, setEmail] = useState('')

  const subscribeToNewsletter = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`${email} subscribed to the newsletter`)
  }

  return (
    <div className=" py-4 bg-[#1a1a1a]"> 
      <Container>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">Navigation</h1>
            <StatusLink label='Home' status="wip" path="/"/>
            <StatusLink label='New Releases' status="na"/>
            <StatusLink label='Trending' status="na"/>
            <StatusLink label='Statistics' status="na"/>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">Resources</h1>
            <StatusLink label='Privacy Policy' status="na" path="/"/>
            <StatusLink label='Terms of Service' status="na" path="/"/>
            <StatusLink label='Cookie Policy' status="na" path="/"/>
            <StatusLink label='Copyright & DMCA Policy' status="na" path="/"/>
            <StatusLink label='Community Guidelines' status="na" path="/"/>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <h1 className="text-xl font-bold">Social Media</h1>
            <a href="">
              Twitter
            </a>
            <a href="">
              Instagram
            </a>
            <a href="https://github.com//dz18" target="_blank">
              GitHub
            </a>
            <a href="">
              Youtube
            </a>
            <a href="">
              LinkedIn
            </a>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h1 className="text-xl font-bold">Newsletter</h1>
            
            <p className="">Want to know what we are up too? Sign up for the newsletter for occasional updates.</p>

            <form onSubmit={subscribeToNewsletter} className="flex flex-col gap-2">
              <input 
                className="border-1 border-gray-500 bg-white p-1 rounded text-black hover:shadow-[0_0_5px_rgba(255,255,255,0.5)] focus:shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                placeholder="Email Address"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <button 
                  className="bg-teal-500 text px-2 py-1 rounded cursor-pointer hover:shadow-[0_0_5px_rgba(0,255,255,0.5)] active:bg-teal-500/50 transition-all" 
                  type="submit"
                > 
                  Subscribe
                </button>
              </div>
            </form>

          </div>
        </div>
      </Container>
    </div>
  )
}