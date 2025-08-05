import { Bell } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function AlertsDropdown () {

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
        ref={dropdownRef}
      >
        <Bell/>
      </div>

      {open &&
        <ul className="absolute right-0 top-full w-max max-w-80 mt-2 border border-white rounded shadow-lg z-10">
          <li>Your notifications will appear here</li>
        </ul>
      }

    </div>
  )
}