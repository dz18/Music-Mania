'use client'

import { AudioLines, Plus, Search } from "lucide-react"
import Link from "next/link"
import SearchBar from "./searchBar/SearchBar"
import { useSession } from "next-auth/react"
import UserDropdown from "./navigationBar/UserDropdown"
import AlertsDropdown from "./navigationBar/AlertsDropdown"
import { usePathname } from "next/navigation"

export default function Nav() {

  const {data : session} = useSession()
  const pathname = usePathname()

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-3 max-h-15 h-full items-center bg-surface">
      <div className="flex items-center gap-3 justify-between h-full">

        <div className="items-center gap-6 text-lg flex">
          <Link 
            className="flex gap-2 items-center hover:[text-shadow-0_0_10px_rgba(255,255,255,0.5)] font-mono whitespace-nowrap hover:text-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            href='/'
          >
            <AudioLines className="text-teal-500" size={32}/>
            <p className="sm:flex hidden font-bold bg-gradient-to-r from-teal-500 via-sky-300 to-pink-300 bg-clip-text text-transparent">Music Mania</p>
          </Link>

        </div>

        <SearchBar/>

        <div className="block sm:hidden">
          <button>
            <Search/>
          </button>
        </div>

        {session ?
          <div className="flex items-center gap-2">
            <UserDropdown/>
          </div>
        :
          <Link 
            className="bg-teal-500 text-black hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition px-2 py-1 rounded text-sm font-bold cursor-pointer font-mono active:bg-teal-500/50"
            href={`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`}
          >
            Sign In
          </Link>
        }


      </div>
    </nav>
  )
}