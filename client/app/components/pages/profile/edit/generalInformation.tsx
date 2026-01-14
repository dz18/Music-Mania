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
      className="bg-surface p-4 flex flex-col gap-2 text-sm"
    >
      <p className="text-lg font-mono font-bold">General Information</p>

      <div>
        <p>Id:</p>
        <input 
          className="border px-2 py-1 rounded w-full"
          type="text" 
          value={id}
          readOnly
        />
      </div>

      <div>
        <p>Username:</p>
        <input 
          className="border px-2 py-1 rounded w-full"
          type="text" 
          value={username}
          onChange={(e) => setData(prev => ({...prev, username: e.target.value}))}
        />
        <p className="text-red-500 mt-1">{errors.username}</p>
      </div>

      <div>
        <p>About Me:</p>
        <textarea
          className="border rounded px-2 py-1 w-full"
          rows={6}
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
  )
}