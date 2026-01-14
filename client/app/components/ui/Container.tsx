import React from "react"

export default function Container ({
  children
} : {
  children : React.ReactNode
}) {
  return (
    <div className="max-w-screen-2xl mx-auto px-2 sm:px-3 lg:px-4">
      {children}
    </div>
  )
}