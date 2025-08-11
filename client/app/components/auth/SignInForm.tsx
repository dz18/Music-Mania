'use client'

import { Loader } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function SignInForm () {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState({
    email : '',
    password : ''
  })

  const handleSignIn = async (e : FormEvent<HTMLFormElement  >) => {
    e.preventDefault()

    if (!email || !password) {
      return
    }

    if (error.email || error.password) {
      return
    }

    try {
      setSubmitting(true)
      const result = await signIn("credentials", {
        email, 
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.toLowerCase().includes("password")) {
          setError(prev => ({ ...prev, password: result.error || '' }))
        } else if (result.error.toLowerCase().includes("user")) {
          setError(prev => ({ ...prev, email: result.error || '' }))
        } else {
          setError(prev => ({ ...prev, email: "Sign In failed" }));
        }
      }
      
      if (result?.ok) {
        router.push('/home')
      }

    } catch (error) {
      alert(`Email: ${email}\nPassword: ${password}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-3 w-80" onSubmit={handleSignIn}>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Email:</label>
        <input
          type="email" 
          placeholder="Email"
          className={`py-1 px-2 border-1 text-sm rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all ${error.email && 'border-red-500'}`}
          value={email}
          onChange={(e) => {
            setError(prev => ({...prev, email : ''}))
            setEmail(e.target.value)
          }}
          required
          disabled={submitting}
          
        />
        {error.email &&
          <p className="text-red-500 text-sm">{error.email}</p>
        }
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="text-sm">Password:</label>
        <input 
          type="password" 
          placeholder="Password"
          className={`py-1 px-2 border-1 text-sm rounded hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all ${error.password && 'border-red-500'}`}
          value={password}
          onChange={(e) => {
            setError(prev => ({...prev, password: ''}))
            setPassword(e.target.value)
          }}
          required
          disabled={submitting}
        />
        {error.password &&
          <p className="text-red-500 text-sm">{error.password}</p>
        }
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