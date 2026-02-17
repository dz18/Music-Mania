import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function PrivateInformation ({
  email, age, setData, errors
}:{
  email: string
  age: string
  setData: Dispatch<SetStateAction<EditProfileForm>>
  errors: EditProfileForm
}) {

  return (
    <div
      className="bg-surface flex flex-col gap-2 text-sm border border-gray-500 overflow-hidden rounded-lg"
    >
      <p className="text-sm font-mono font-bold bg-surface-elevated px-4 py-2">Private Information</p>

      <div
        className="px-4 py-2 gap-2 flex flex-col" 
      >
        <div>
          <p className="mb-1">Email:</p>
          <input 
            type="email" 
            className="border px-2 py-1 w-full rounded input-glow"
            value={email}
            readOnly
          />
          <p className="text-red-500 mt-1">{errors.email}</p>
        </div>
        
        <div>
          <p className="mb-1">Age:</p>
          <input 
            type="number" 
            className="border px-2 py-1 w-full rounded input-glow"
            value={age}
            onChange={(e) => setData(prev => ({...prev, age: e.target.value}))}
          />
          <p className="text-red-500 mt-1">{errors.age}</p>
        </div>

      </div>


    </div>
  )
}