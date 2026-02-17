import { Cog, LogOut, Settings, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useRef, useState } from "react"

export default function UserDropdown() {

  const router = useRouter()
  const {data : session} = useSession()

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function clickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block" ref={dropdownRef}>

      <div
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center interactive-button interactive-dark px-2"
      >
        <div className="overflow-hidden">
          <p className="truncate font-semibold text-right">{session?.user.username}</p>
          <p className="truncate text-gray-500 text-sm">{session?.user.email}</p>
        </div>
        <div className="flex p-2 gap-2 items-center">
          <img 
            src={`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${session?.user.id}?v=${Date.now()}`}
            alt="Avatar"
            className="w-10 h-10 shrink-0 min-w-10 object-cover"
            onError={e => { e.currentTarget.src = '/default-avatar.jpg'}}
          />
        </div>
      </div>

      {open &&
        <div className="absolute right-0 top-full w-max max-w-80 min-w-50 mt-2 border border-gray-500 rounded shadow-lg z-10 bg-surface">
          
          <ul className="text-base">

            <li
              className="p-2 flex items-center gap-2 interactive-button interactive-dark"
              onClick={() => router.push(`/profile/${session?.user.id}`)}
            >
              <User size={18}/> Profile
            </li>

            <li
              className="interactive-button interactive-dark p-2 flex items-center gap-2"
              onClick={() => router.push(`/profile/${session?.user.id}/edit`)}
            >
              <Settings size={18}/> Settings
            </li>
            
            <li className="border-b-1 border-gray-500 mx-1"/>

            <li
              className="interactive-button interactive-dark p-2 flex gap-2 items-center"
              title="signout"
              onClick={() => signOut()}
            >
              <LogOut size={18}/>Signout
            </li>
            
          </ul>
        </div>
      }

    </div>
  )
}