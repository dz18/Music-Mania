import axios from "axios"
import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function GeneralInformation ({
  id, username, aboutMe, setData, createdAt, errors
} : {
  id: string
  username: string
  aboutMe: string
  createdAt: Date
  setData: Dispatch<SetStateAction<EditProfileForm>>
  errors: EditProfileForm
}) {

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated') return

    setData(prev => ({...prev, username: session.user.username ?? ''}))
    setData(prev => ({...prev, id: session.user.id ?? ''}))

    const fetchAboutMe = async () => {
      // const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/aboutMe`)
    }

    fetchAboutMe()

  }, [session?.user])

  return (
    <div
      className="bg-surface flex flex-col gap-2 text-sm border border-gray-500 rounded-lg overflow-hidden"
    >
      <p className="text-sm font-mono font-bold px-4 py-2 bg-surface-elevated">General Information</p>

      <div
        className="px-4 py-2 flex flex-col gap-2"
      >
        <div>
          <p className="mb-1">Id:</p>
          <input 
            className="border px-2 py-1 rounded w-full input-glow"
            type="text" 
            value={id}
            readOnly
          />
        </div>

        <div>
          <p className="mb-1">Username:</p>
          <input 
            className="border px-2 py-1 rounded w-full input-glow"
            type="text" 
            value={username}
            onChange={(e) => setData(prev => ({...prev, username: e.target.value}))}
          />
          <p className="text-red-500 mt-1">{errors.username}</p>
        </div>

        <div>
          <div>
            <p className="mb-1">About Me:</p>
            <p></p>
          </div>
          <textarea
            className="border rounded px-2 py-1 w-full input-glow"
            rows={8}
            value={aboutMe}
            onChange={(e) => setData(prev => ({...prev, aboutMe: e.target.value}))}
          />
          <p className="text-red-500 mt-1">{errors.aboutMe}</p>
        </div>

        <div>
          <p>
          {createdAt &&
            `Joined: ${new Date(createdAt).toLocaleDateString()}`
          }
          </p>
        </div>

      </div>

    </div>
  )
}