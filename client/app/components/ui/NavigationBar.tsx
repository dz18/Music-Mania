'use client'

import { AudioLines, Plus } from "lucide-react"
import Link from "next/link"
import SearchBar from "./navigationBar/SearchBar"
import { useSession } from "next-auth/react"
import UserDropdown from "./navigationBar/UserDropdown"
import AlertsDropdown from "./navigationBar/AlertsDropdown"

export default function Nav() {

  const {data : session} = useSession()

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-3 max-h-15 h-full items-center">
      <div className="flex items-center text-lg gap-6 justify-between h-full">

        <div className="flex items-center gap-6">
          <Link 
            className="flex gap-2 items-center hover:[text-shadow-0_0_10px_rgba(255,255,255,0.5)] font-mono whitespace-nowrap"
            href='/'
          >
            <AudioLines className="text-teal-500"/>
            Music Mania
          </Link>

        </div>


        <SearchBar/>

        {session ?
          <div className="flex items-center gap-2">
            <button 
              className="flex gap-1 text-base items-center font-mono border-1 border-white px-2 py-1 rounded-xl cursor-pointer hover:bg-white/10"
              onClick={() => alert('go to create page')}
              title="Create"
            >
              Create<Plus/>
            </button>
            <AlertsDropdown/>
            <UserDropdown/>
          </div>
        :
          <Link 
            className="bg-teal-500 text-black hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition px-2 py-1 rounded text-sm font-bold cursor-pointer font-mono active:bg-teal-500/50"
            href='/login'
          >
            Login
          </Link>
        }


      </div>
    </nav>
  )
}