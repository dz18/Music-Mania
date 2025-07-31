'use client'

// Temporarily use to track pages progress

import { ShieldAlert, ShieldCheck, ShieldOff} from "lucide-react"
import Link from "next/link"

const icons = {
  wip: <ShieldAlert />,
  na: <ShieldOff />,
  completed: <ShieldCheck />,
}

const colors = {
  wip: 'text-orange-500',
  na: 'text-red-500',
  completed: 'text-green-500',
}

export default function StatusLink ({
  label, status, path
} : {
    label : string, 
    status : 'wip' | 'na' | 'completed',
    path?: string,
}) {

  return (
    <Link 
      className={`flex ${colors[status]} gap-1 items-center cursor-pointer text-sm`}
      href={path || ''}
    >
      {icons[status]}
      {label}
    </Link>
  )

}