'use client'

import { Search } from "lucide-react"
import { FormEvent, useState } from "react"

export default function SearchBar () {
  const [value, setValue] = useState('')

  const submit = (e : FormEvent<HTMLFormElement> ) => {
    e.preventDefault()
    alert(`Searched '${value}'`)
  }

  return (
    <form className="w-full" onSubmit={submit}>
      <div className="relative">
        <button 
          className="absolute left-2 bottom-0 top-0 items-center cursor-pointer"
          type="submit"
        >
          <Search 
            size={18}
          />
        </button>
        <input 
          className="block w-full p-1 ps-8 text-sm border-1 rounded-xl hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] focus:shadow-[0_0_15px_rgba(0,255,255,0.8)] focus:outline-none transition-shadow"
          placeholder="Search"
          type="search" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </form>
  )
}