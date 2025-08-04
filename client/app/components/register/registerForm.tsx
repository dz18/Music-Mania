'use client'

import axios from "axios"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function RegisterForm () {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const register = async (e : FormEvent<HTMLFormElement  >) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      return
    }

    try {
      setSubmitting(true)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        email: email,
        username: username,
        password: password,
        phoneNumber: phoneNumber
      }, {
        timeout: 5000
      })

      router.push('/login')

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to register account:', error)
        console.error('Request URL:', error.config?.url)
      } else {
        console.error('Unknown Error:', error)
      }
    } finally {
      setSubmitting(false)
    }

  }

  return (
    <form className="flex flex-col gap-3 w-80" onSubmit={register}>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Email:</label>
        <input 
          type="email" 
          id="email" 
          placeholder="Email"
          className="text-sm py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Username:</label>
        <input 
          type="text" 
          id="username" 
          placeholder="Username"
          className="text-sm py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Phone Number:</label>
        <input 
          type="tel" 
          id="phone_number" 
          placeholder="Phone Number"
          className="text-sm py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Password:</label>
        <input 
          type="password" 
          id="password" 
          placeholder="Password"
          className="text-sm py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Confirm Password:</label>
        <input 
          type="password" 
          id="confirm_password" 
          placeholder="Confirm Password"
          className="text-sm py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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