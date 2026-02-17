import axios, { AxiosError } from "axios"
import { Loader } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"

export default function Security ({
  email, setData
} : {
  email: string
  setData: Dispatch<SetStateAction<EditProfileForm>>
}) {

  const { data: session } = useSession()

  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [firstError, setError] = useState('')
  const [firstLoading, setFirstLoading] = useState(false)

  const [secondError, setSecondError] = useState('')
  const [secondLoading, setSecondLoading] = useState(false)

  const [result, setResult] = useState('')

  const handlePasswordConfirm = async () => {

    try {
      setFirstLoading(true)

      const token = `Bearer ${session?.user.token}`
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirmPassword`, {
        email, password: confirmPassword
      } , {
        headers: {
          Authorization: token
        }
      })

      setConfirmed(true)
      setError('')

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error)
      }
      console.error(error)
      setConfirmed(false)
    } finally {
      setFirstLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      setSecondError('Passwords do not match.')
      return
    }
    
    if (newPassword.length <= 3) {
      setSecondError('Password must be more then 3 characters.')
      return
    }

    try {
      setSecondError('')
      setSecondLoading(true)
      const token = `Bearer ${session?.user.token}`
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/changePassword`, {
        email, newPassword, confirmNewPassword
      } , {
        headers: {
          Authorization: token
        }
      }) 
      await signOut({redirect: false})
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSecondError('Unknown error occurred. Try again later.')
      }
      console.error(error)
    } finally {
      setSecondLoading(false)
    }
  }

  return (
    <div
      className="bg-surface flex flex-col gap-2 rounded-lg overflow-hidden border border-gray-500"
    >
      <p className="font-mono font-bold text-sm px-4 py-2 bg-surface-elevated">Security</p>

      <div
        className="px-4 py-2 flex flex-col gap-2"
      >
        
        <div>
          <p className="mb-1">Confirm Password:</p>
          <input 
            type="password" 
            className="border px-2 py-1 w-full rounded disabled:opacity-40 disabled:cursor-auto"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={confirmed}
          />
          <p className="mt-2 text-red-500">{firstError}</p>
          <button
            className="bg-teal-500 px-2 py-1 rounded cursor-pointer justify-center flex disabled:opacity-40 disabled:cursor-auto"
            onClick={handlePasswordConfirm}
            disabled={confirmed}
          >
            {firstLoading ? <Loader size={18} className="animate-spin"/> : "Confirm Password"}
          </button>
        </div>

        <div>
          <p className={`${!confirmed && 'text-gray-500'} mb-1`}>New Password:</p>
          <input 
            type="password" 
            className="border px-2 py-1 w-full rounded disabled:opacity-40"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={!confirmed}
          />
        </div>

        <div>
          <p className={`${!confirmed && 'text-gray-500'} mb-1`}>Re-enter New Password:</p>
          <input 
            type="password" 
            className="border px-2 py-1 w-full rounded disabled:opacity-40"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            disabled={!confirmed}
          />
        </div>

        <div>
          <button
            className="bg-red-500 px-2 py-1 rounded cursor-pointer disabled:opacity-40 disabled:cursor-auto"
            disabled={!confirmed}
            onClick={handlePasswordChange}
          >
            {secondLoading ? <Loader size={18} className="animate-spin"/> : "Reset Password"}
          </button>
          <p className="text-red-500 mt-1">{secondError}</p>
        </div>


        {confirmed &&
          <p>
            <span className="text-red-500">WARNING: </span>
            You will be logged out after changing password
          </p>
        }
      </div>
    </div>
  )
}