'use client'

import { Loader } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function LoginForm () {

  const router = useRouter()

  const [email, setEmail] = useState('zuniga18dz@gmail.com')
  const [password, setPassword] = useState('asd')
  const [submitting, setSubmitting] = useState(false)

  const login = async (e : FormEvent<HTMLFormElement  >) => {
    e.preventDefault()

    if (!email || !password) {
      return
    }

    try {
      setSubmitting(true)
      const result = await signIn("credentials", {
        email, 
        password
      })

      if (result?.error) {
        alert('error')
      } 

    } catch (error) {
      alert(`Email: ${email}\nPassword: ${password}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-3 w-80" onSubmit={login}>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Email:</label>
        <input 
          type="email" 
          placeholder="Email"
          className="py-1 px-2 border-1 text-sm rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Password:</label>
        <input 
          type="password" 
          placeholder="Password"
          className="py-1 px-2 border-1 text-sm rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button 
        className="bg-white text-black px-1 py-2 rounded cursor-pointer font-mono hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] text-sm active:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:bg-white/80 transition-all"
        disabled={submitting}
      >
        {submitting ? 
          <div className="flex justify-center">
            <Loader size={19} className="animate-spin"/> 
          </div>
        : 
          'Submit'
        }
      </button>
    </form>
  )
}