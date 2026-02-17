import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useRef } from "react"

export default function Avatar ({
  newAvatar, currentAvatar, reset, setAvatarFile, setData, errors
} : {
  newAvatar: string
  currentAvatar: string
  reset: boolean
  setAvatarFile: Dispatch<SetStateAction<File | null>>
  setData: Dispatch<SetStateAction<EditProfileForm>>
  errors: EditProfileForm
}) {

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setData(prev => ({...prev, avatar: previewUrl}))
    setAvatarFile(file)
  }

  const resetAvatar = () => {
    if (reset) return

    setData(prev => ({...prev, avatar: '', resetAvatar: true}))
    setAvatarFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = "" 
    }
  }

  return (
    <div
      className="bg-surface gap-2 flex flex-col rounded-lg border border-gray-500 overflow-hidden"
    >
      <p className="text-sm font-mono font-bold px-4 py-2 bg-surface-elevated">Avatar</p>

      <div className="flex justify-center">

        <div className="rounded-2xl flex">

          <div className="my-4 mx-8 flex flex-col items-center gap-2">
            <p className="font-semibold">Current Avatar</p>
            <img 
              className="w-50 h-50 object-cover"
              src={currentAvatar} 
              alt="Avatar" 
              onError={(e) => { 
                e.currentTarget.src = '/default-avatar.jpg' 
              }}
            />
          </div>

          <div className="my-4 mx-10 flex flex-col items-center gap-2">
            <p className="font-semibold">Updated Avatar</p>

            <img
              className="w-50 h-50 object-cover"
              src={newAvatar ? newAvatar : reset ? `/default-avatar.jpg` : currentAvatar} 
              alt="Avatar" 
              onError={(e) => { e.currentTarget.src = '/default-avatar.jpg' }}
            />
            <div className="flex gap-2">
              <button
                className="border rounded px-2 py-1 interactive-button interactive-dark"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Avatar
              </button>
              <button
                className="bg-red-950 text-red-500 border border-red-500 rounded px-2 py-1 interactive-button hover:bg-red-900 active:bg-red-800"
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