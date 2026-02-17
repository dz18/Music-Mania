'use client'

import Avatar from "@/app/components/pages/profile/edit/avatar"
import GeneralInformation from "@/app/components/pages/profile/edit/generalInformation"
import PrivateInformation from "@/app/components/pages/profile/edit/privateInformation"
import Security from "@/app/components/pages/profile/edit/security"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import LoadingText from "@/app/components/ui/loading/LoadingText"
import RefreshPage from "@/app/components/ui/RefreshPage"
import axios from "axios"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditProfilePage ({
  userId
} : {
  userId: string
}) {

  const { data: session, status, update } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const [originalData, setOriginalData] = useState<EditProfileForm>({
    avatar: '',
    id: '',
    username: '',
    aboutMe: '',
    createdAt: new Date(),
    email: '',
    age: '',
    resetAvatar: false
  })
  const [data, setData] = useState<EditProfileForm>({
    avatar: '',
    id: '',
    username: '',
    aboutMe: '',
    createdAt: new Date(),
    email: '',
    age: '',
    resetAvatar: false
  })
  const [errors, setErrors] = useState<EditProfileForm>({
    avatar: '',
    id: '',
    username: '',
    aboutMe: '',
    createdAt: new Date(),
    email: '',
    age: '',
    resetAvatar: false
  })

  const [hasFetched, setHasFetched] = useState(false)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('/default-avatar.jpg')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const unsaved = JSON.stringify(data) === JSON.stringify(originalData)

  const fetchData = async () => {
    if (!session || status !== 'authenticated') return
    if (hasFetched) return
    
    const token = `Bearer ${session?.user.token}`

    try {
      const res = await axios.get<EditProfileForm>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/edit`, {
        params: { profileId: session.user.id },
        headers: {
          Authorization: token
        } 
      })

      setData(res.data)
      setOriginalData(res.data)
      setHasFetched(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error)
      }
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [session])

  useEffect(() => {
    if (!session) return

    console.log(`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${session.user.id}v=${Date.now()}`)

    setCurrentAvatarUrl(`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${session.user.id}?v=${Date.now()}`)
  }, [session])

  if (!hasFetched && !error) {
    return (
      <div className="flex flex-col gap-2">
        <LoadingText text="Loading Profile Information"/>
        <LoadingBox className="h-6 w-50"/>
        <LoadingBox className="h-50 w-full"/>
        <LoadingBox className="h-50 w-full"/>
        <LoadingBox className="h-50 w-full"/>
        <LoadingBox className="h-50 w-full"/>
      </div>
    )
  }

  if (error) {
    return (
      <RefreshPage
        func={fetchData}
        title="Profile Page"
        loading={loading}
        note={error ?? "Unknown Error Occurred. Try Again."}
      />
    )
  }

  if (status === 'unauthenticated') {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    if (avatarFile) formData.append('avatar', avatarFile)
    formData.append('username', data.username)
    formData.append('aboutMe', data.aboutMe)
    formData.append('age', data.age)
    const updatedAt = new Date()
    formData.append('updatedAt', updatedAt.toISOString())
    console.log(data.resetAvatar)
    if (data.resetAvatar) formData.append('resetAvatar', 'true')

    const token = `Bearer ${session?.user.token}`

    try {
      setLoading(true)
      setResult('')

      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/edit`, formData, {
        headers : {
          Authorization: token
        }
      })

      setErrors({
        avatar: '',
        id: '',
        username: '',
        aboutMe: '',
        createdAt: new Date(),
        email: '',
        age: '',
        resetAvatar: false
      })

      if (res.data.url) {
        await axios.put(res.data.url, avatarFile)
      }

      setCurrentAvatarUrl(
        data.resetAvatar ? "/default-avatar.jpg" : `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${session?.user.id}v=${Date.now()}`
      )
      
      setResult(res.data.message)
      setData(res.data.data)
      setOriginalData(res.data.data)

      if (session) {
        await update({
          ...session,
          user: {
            username: res.data.data.username
          }
        })
        
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData: Map<string, string> = error.response?.data.errors
        setErrors(prev => ({...prev, ...errorData}))
        if(error.response?.status === 409)
          setResult('Input validation failed. One or more inputs are invalid.')
        else
          setResult('Unknown Error Occurred. Try Again Later.')
      }
      console.error(error)
    } finally {
      setLoading(false)
    }

  }
  
  return (
    <div className="flex flex-col gap-4 text-sm">

      <div>
        <p className="text-xl font-mono font-bold">Edit Profile</p>
        <p className="text-gray-500 font-mono text-lg font-bold">{originalData.username}</p>
      </div>

      <Avatar
        newAvatar={data.avatar}
        currentAvatar={currentAvatarUrl}
        reset={data.resetAvatar}
        setAvatarFile={setAvatarFile}
        setData={setData}
        errors={errors}

      />

      <GeneralInformation
        id={data.id}
        username={data.username}
        aboutMe={data.aboutMe}
        createdAt={data.createdAt}
        setData={setData}
        errors={errors}
      />

      <PrivateInformation
        email={data.email}
        age={data.age}
        setData={setData}
        errors={errors}
      />

      <Security
        email={originalData.email}
        setData={setData}
      />

      <div className="flex bg-surface p-4 justify-end items-center gap-2 border border-gray-500 rounded-lg">
        <p className="text-gray-500">{result}</p>
        <button
          className="px-2 py-1 bg-teal-500 rounded cursor-pointer disabled:opacity-40"
          disabled={unsaved}
          onClick={handleSubmit}
        >
          {loading ? <Loader className="animate-spin" size={18}/>: `Save Changes`}
        </button>
      </div>

    </div>
  )
}