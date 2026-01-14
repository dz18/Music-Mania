import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function PrivateInformation ({
  email, phoneNumber, age, setData, errors
}:{
  email: string
  phoneNumber: string
  age: string
  setData: Dispatch<SetStateAction<EditProfileForm>>
  errors: EditProfileForm
}) {

  const { data: session } = useSession()

  useEffect(() => {
    if (!session) return

    const fetchPrivateInfo = async () => {

    }

    fetchPrivateInfo()

  }, [session?.user.id])

  return (
    <div
      className="bg-surface p-4 flex flex-col gap-2 text-sm"
    >
      <p className="text-lg font-mono font-bold">Private Information</p>

      <div>
        <p>Email:</p>
        <input 
          type="email" 
          className="border px-2 py-1 w-full rounded"
          value={email}
          readOnly
        />
        <p className="text-red-500 mt-1">{errors.email}</p>
      </div>

      <div>
        <p>Phone Number:</p>
        <input 
          type="text" 
          className="border px-2 py-1 w-full rounded"
          value={phoneNumber}
          onChange={(e) => setData(prev => ({...prev, phoneNumber: e.target.value}))}
        />
        <p className="text-red-500 mt-1">{errors.phoneNumber}</p>
      </div>
      
      <div>
        <p>Age:</p>
        <input 
          type="number" 
          className="border px-2 py-1 w-full rounded"
          value={age}
          onChange={(e) => setData(prev => ({...prev, age: e.target.value}))}
        />
        <p className="text-red-500 mt-1">{errors.age}</p>
      </div>


    </div>
  )
}