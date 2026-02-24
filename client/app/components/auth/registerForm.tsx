'use client'

import axios from "axios"
import { Loader } from "lucide-react"
import { signIn } from "next-auth/react"
import { usePathname } from "next/navigation"
import { FormEvent, useState } from "react"

export default function RegisterForm ({callbackUrl} : {callbackUrl : string}) {

  const path = usePathname()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setErrors] = useState({
    email: '',
    username: '',
    confirmPassword: '',
  })

  const register = async (e : FormEvent<HTMLFormElement  >) => {
    e.preventDefault()

    if (!email || !password || !username || !confirmPassword) {
      return
    }

    if (password !== confirmPassword) {
      setErrors(prev => ({...prev, confirmPassword : 'Passwords do not match'}))
      return
    }

    if (error.email || error.username || error.confirmPassword) return

    try {
      setSubmitting(true)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        email: email,
        username: username,
        password: password,
      }, {
        timeout: 5000
      })

      signIn('credentials',{
        email,
        password,
        callbackUrl: callbackUrl
      })

    } catch (error : any) {
    
      if (error.response) {
        const {status, data} = error.response
        console.log(data)
        if (status === 409) {
          console.log(data.error)
          if (data.error.email) {
            setErrors(prev => ({...prev, email: data.error.email}))
          } 
          if (data.error.username) {
            setErrors(prev => ({...prev, username: data.error.username}))
          }
        }

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
          className={`text-sm py-1 px-2 border rounded input-glow transition-all ${error.email && 'border-red-500'}`}
          value={email}
          onChange={(e) => {
            setErrors(prev => ({...prev, email : ""}))
            setEmail(e.target.value)
          }}
          required
        />
        {error.email && 
          <p className="text-sm text-red-500">{error.email}</p>
        }
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Username:</label>
        <input 
          type="text" 
          id="username" 
          placeholder="Username"
          className={`text-sm py-1 px-2 border rounded input-glow transition-all ${error.username && 'border-red-500'}`}
          value={username}
          onChange={(e) => {
            setErrors(prev => ({...prev, username : ""}))
            setUsername(e.target.value)
          }}
          required
        />
        {error.username && 
          <p className="text-sm text-red-500">{error.username}</p>
        }
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Password:</label>
        <input 
          type="password" 
          id="password" 
          placeholder="Password"
          className={`text-sm py-1 px-2 border rounded input-glow transition-all ${error.confirmPassword && 'border-red-500'}`}
          value={password}
          onChange={(e) => {
            setErrors(prev => ({...prev, confirmPassword : ""}))
            setPassword(e.target.value)
          }}
          required
        />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Confirm Password:</label>
        <input 
          type="password" 
          id="confirm_password" 
          placeholder="Confirm Password"
          className={`text-sm py-1 px-2 border-1 rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all ${error.confirmPassword && 'border-red-500'}`}
          value={confirmPassword}
          onChange={(e) => {
            setErrors(prev => ({...prev, confirmPassword : ""}))
            setConfirmPassword(e.target.value)
          }}
          required
        />
        {error.confirmPassword && 
          <p className="text-sm text-red-500">{error.confirmPassword}</p>
        }
      </div>
      <button 
        className="bg-teal-950 text-teal-300 border border-teal-300 input-glow px-1 py-2 rounded interactive-button font-mono text-sm font-semibold"
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