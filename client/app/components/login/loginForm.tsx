'use client'

import { FormEvent, useState } from "react"

export default function LoginForm () {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = (e : FormEvent<HTMLFormElement  >) => {
    e.preventDefault()
    alert(`Email: ${email}\nPassword: ${password}`)
  }

  return (
    <form className="flex flex-col gap-3 w-80" onSubmit={login}>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Email:</label>
        <input 
          type="email" 
          placeholder="Email"
          className="py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Password:</label>
        <input 
          type="password" 
          placeholder="Password"
          className="py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="bg-white text-black px-1 py-2 rounded cursor-pointer font-mono hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] text-sm active:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:bg-white/80 transition-all">
        Submit
      </button>
    </form>
  )
}