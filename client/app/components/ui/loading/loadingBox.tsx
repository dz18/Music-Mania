
import React from 'react'

interface LoadingBoxProps {
  className?: string
}

const LoadingBox: React.FC<LoadingBoxProps> = ({ className }) => {
  return (
    <div
      className={`
        bg-gray-700 
        animate-pulse 
        rounded-md
        ${className || 'w-full h-6'}
      `}
    />
  )
}

export default LoadingBox