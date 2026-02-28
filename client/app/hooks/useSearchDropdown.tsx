import { useState } from "react"

function useDropdown() {
  const [open, setOpen] = useState(false)

  const openDropdown = () => setOpen(true)
  const closeDropdown = () => setOpen(false)
  const toggleDropdown = () => setOpen(prev => !prev)

  return {
    open,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    setOpen
  }
}

export default useDropdown