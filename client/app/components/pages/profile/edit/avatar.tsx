import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useRef } from "react"

export default function Avatar ({
  avatar, setAvatarFile, setData, errors
} : {
  avatar: string
  setAvatarFile: Dispatch<SetStateAction<File | null>>
  setData: Dispatch<SetStateAction<EditProfileForm>>
  errors: EditProfileForm
}) {

  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setData(prev => ({...prev, avatar: previewUrl}))
    setAvatarFile(file)
  }

  const resetAvatar = () => {
    setData(prev => ({...prev, avatar: ''}))
    setAvatarFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = "" 
    }
  }

  return (
    <div
      className="bg-surface p-4 gap-2 flex flex-col"
    >
      <p className="text-lg font-mono font-bold">Avatar</p>

      <div className="flex">

        <div className="border-dashed border-2 rounded-2xl flex">

          <div className="my-4 mx-8 flex flex-col items-center gap-2">
            <p className="font-semibold">Current Avatar</p>
            <img 
              className="w-50 h-50 object-cover"
              src={`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${session?.user.id}?v=${Date.now()}`} 
              alt="Avatar" 
              onError={(e) => { e.currentTarget.src = '/default-avatar.jpg' }}
            />
          </div>

          <div className="border-l-2 border-dashed border-gray-300" />

          <div className="my-4 mx-10 flex flex-col items-center gap-2">
            <p className="font-semibold">Updated Avatar</p>

            <img
              className="w-50 h-50 object-cover"
              src={avatar || `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${session?.user.id}?v=${Date.now()}`} 
              alt="Avatar" 
              onError={(e) => { e.currentTarget.src = '/default-avatar.jpg' }}
            />
            <div className="flex gap-2">
              <button
                className="border rounded px-2 py-1 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Avatar
              </button>
              <button
                className="bg-red-500 rounded px-2 py-1 cursor-pointer"
                onClick={resetAvatar}
              >
                Reset Avatar
              </button>
            </div>
          </div>

        </div>


      </div>

      <p className="text-red-500">{errors.avatar}</p>
      
      <input 
        ref={fileInputRef}
        className="hidden"
        type="file" 
        accept="image/"
        onChange={changeAvatar}
      />

    </div>
  )
}