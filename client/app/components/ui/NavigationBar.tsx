import { AudioLines } from "lucide-react"
import Link from "next/link"
import SearchBar from "./navigationBar/SearchBar"

const links = [
  {label : 'Home', href : '/home'},
  {label : 'New Releases', href : ''},
  {label : 'Trending', href : ''},
  {label : 'Statistics', href : ''},
]

export default function Nav() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-3">
      <div className="flex items-center text-lg gap-6">
        <div className="flex grow-2">
          <Link 
            className="flex gap-2 items-center hover:[text-shadow-0_0_10px_rgba(255,255,255,0.5)] font-mono"
            href='/'
          >
            <AudioLines className="text-teal-500"/>
            Music Mania
          </Link>

        </div>

        <div className="flex grow">
          <SearchBar/>
        </div>

        <div className="flex gap-6 items-center">
        
          {links.map((link, i) => (
            <Link 
              className="hover:text-shadow-[0_0_10px_rgba(255,255,255,0.5)] font-mono"
              key={i}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}

          
          <Link 
            className="bg-teal-500 text-black hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition px-2 py-1 rounded text-sm font-bold cursor-pointer font-mono active:bg-teal-500/50"
            href='/login'
          >
            Login
          </Link>

        </div>



      </div>
    </nav>
  )
}