'use client'

import Container from "./Container"
import { GrGithub } from "react-icons/gr"
import { FaLinkedin } from "react-icons/fa"
import Link from "next/link"
import { BriefcaseBusiness, FolderCode } from "lucide-react"

export default function Footer () {

  return (
    <div className=" py-4 bg-[#1a1a1a]"> 
      <Container>
        <div className="mx-4 flex flex-col gap-4">
          <p className="text-center font-mono">
            Thank you for using <b>Music Mania</b>
          </p>
          <div className="flex gap-6 justify-center">
            <Link className="flex flex-col items-center gap-1 group hover:text-teal-300" href='https://github.com/dz18/Music-Mania ' target="_blank">
              <div className="bg-surface-elevated p-2 rounded-full interactive-button border border-transparent group-hover:bg-teal-950 group-hover:text-teal-300 group-hover:border-teal-300 active:bg-teal-800" >
                <FolderCode size={36}/>
              </div>
              <span className="text-sm font-semibold">Project</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 group hover:text-teal-300" href='https://github.com/dz18' target="_blank">
              <div className="bg-surface-elevated p-2 rounded-full interactive-button border border-transparent group-hover:bg-teal-950 group-hover:text-teal-300 group-hover:border-teal-300 active:bg-teal-800">
                <GrGithub size={36}/>
              </div>
              <span className="text-sm font-semibold">GitHub</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 group hover:text-teal-300" href='https://www.linkedin.com/in/dz18/' target="_blank">
              <div className="bg-surface-elevated p-2 rounded-full interactive-button border border-transparent group-hover:bg-teal-950 group-hover:text-teal-300 group-hover:border-teal-300 active:bg-teal-800">
                <FaLinkedin size={36}/>
              </div>
              <span className="text-sm font-semibold">LinkedIn</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 group hover:text-teal-300" href='' target="_blank">
              <div className="bg-surface-elevated p-2 rounded-full interactive-button border border-transparent group-hover:bg-teal-950 group-hover:text-teal-300 group-hover:border-teal-300 active:bg-teal-800">
                <BriefcaseBusiness size={36}/>
              </div>
              <span className="text-sm font-semibold">Portfolio</span>
            </Link>
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