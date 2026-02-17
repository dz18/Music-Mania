'use client'

import Container from "./Container"
import { FormEvent, useState } from "react"
import { GrGithub } from "react-icons/gr"
import { FaLinkedin } from "react-icons/fa"
import Link from "next/link"

export default function Footer () {

  const [email, setEmail] = useState('')

  const subscribeToNewsletter = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`${email} subscribed to the newsletter`)
  }

  return (
    <div className=" py-4 bg-[#1a1a1a]"> 
      <Container>
        <div className="mx-4 flex flex-col gap-4">
          <p className="text-center font-mono">
            Thank you for using <b>Music Mania</b>
          </p>
          <div className="flex gap-4 justify-center">
            <Link className="bg-surface-elevated p-2 rounded-full interactive-button" href='https://github.com/dz18/Music-Mania' target="_blank">
              <GrGithub size={36}/>
            </Link>
            <Link className="bg-surface-elevated p-2 rounded-full interactive-button" href='https://www.linkedin.com/in/dz18/' target="_blank">
              <FaLinkedin size={36}/>
            </Link>
            <button></button>
          </div>
          <div className="text-center text-sm italic opacity-75 text-gray-500">
            <p>
              <b>Privacy Note:</b> This is a developer portfolio project. 
              Data is collected solely for functional 
              demonstration and will never be shared or used commercially.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}