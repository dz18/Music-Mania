'use client'

import { Loader } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function SignInForm ({callbackUrl} : {callbackUrl: string}) {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState({
    email : '',
    password : '',
    general: ''
  })

  const isError = Object.values(error).some(e => e !== '')

  const handleSignIn = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) return;
    if (error.email || error.password) return;

    try {
      setSubmitting(true)
      setError({
        email : '',
        password : '',
        general: ''
      })

      const result = await signIn("credentials", {
        email, 
        password,
        redirect: false,
        callbackUrl: callbackUrl
      })

      if (result?.error) {
        if (result.error.toLowerCase().includes("password")) {
          setError(prev => ({ ...prev, password: result.error || '' }))
        } else if (result.error.toLowerCase().includes("user")) {
          setError(prev => ({ ...prev, email: result.error || '' }))
        } else {
          setError(prev => ({ ...prev, general: "Sign-In failed" }));
        }
      }
      
      if (result?.ok) {
        router.push(callbackUrl)
      }

    } catch (error) {
      console.error(error)
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
          className={`py-1 px-2 border text-sm rounded input-glow transition-all ${error.email && 'border-red-500'}`}
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
          className={`py-1 px-2 border text-sm rounded input-glow transition-all ${error.password && 'border-red-500'}`}
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
        className={`
          ${isError ? 'bg-red-950 text-red-500 border-red-500' : 'bg-teal-950 text-teal-300 border-teal-300'}
           input-glow px-1 py-2 rounded interactive-button font-mono text-sm font-semibold border`}
        disabled={submitting}
      >
        {submitting ? 
          <div className="flex justify-center">
            <Loader size={19} className="animate-spin"/> 
          </div>
        : 
          <p>{isError ? 'Try Again' : "Sign-In"}</p>
        }
      </button>
      {error.general && 
        <p className="font-mono text-xs text-red-500 font-semibold text-center">
          <span>Error: </span>{error.general}
        </p>
      }
    </form>
  )
}