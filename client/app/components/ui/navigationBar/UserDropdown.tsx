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
      >
        <Image 
          src='/default-avatar.jpg'
          alt="source"
          width={28}
          height={28}
          className="rounded-full cursor-pointer"
        />
      </div>

      {open &&
        <div className="absolute right-0 top-full w-max max-w-80 mt-2 border border-white rounded shadow-lg z-10">
          
          <ul className="text-base">
            
            <li className="flex p-2 gap-2 items-center">
              <div>
                <Image  
                  src='/default-avatar.jpg' 
                  alt="avatar" 
                  width={40}
                  height={40}
                  className="aspect-square rounded-full"
                />
              </div>
              <div className="overflow-hidden">
                <p className="truncate">{session?.user.username}</p>
                <p className="truncate">{session?.user.email}</p>
              </div>
            </li>

            <li className="border-b-1 border-gray-500"/>

            <li
              className="cursor-pointer hover:bg-white/20 p-2"
              onClick={() => router.push(`/profile/${session?.user.id}`)}
            >
              Profile
            </li>

            <li
              className="cursor-pointer hover:bg-white/20 p-2"
              onClick={() => router.push('/settings')}
            >
              Settings
            </li>
            
            <li className="border-b-1 border-gray-500"/>

            <li
              className="cursor-pointer hover:bg-white/20 p-2"
              title="signout"
              onClick={() => signOut()}
            >
              Signout
            </li>
            
          </ul>
        </div>
      }

    </div>
  )
}