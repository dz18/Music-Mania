import { LikedRelease } from "@/app/lib/types/profile"
import { ImageOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export default function LikeReleaseCard ({
  like,
} : {
  like: LikedRelease,
}) {

  const router = useRouter()
  
  return (
    <button 
      className="relative overflow-hidden group flex items-center gap-2 px-2 py-2 border bg-surface-elevated border-white/5 rounded interactive-button"
      onClick={() => router.push(`/release/${like.releaseId}`)}
    >

      {/* Content Wrapper ABOVE gradient */}
      <div className="relative z-10 flex items-center gap-2 w-full">

        <div className="w-20 h-20 overflow-hidden bg-surface flex items-center justify-center">
          {like.release.coverArt ? (
            <img 
              // ref={imgRef}
              src={like.release.coverArt} 
              className="w-full h-full border-2 border-white/5 object-cover"
              // onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center text-white/5 border-white/5 border-2 border-dashed flex-col rounded-lg">
              <ImageOff size={24}/>
              <p className="font-mono text-sm font-bold">N/A</p>
            </div>
          )}
        </div>

        <div className="text-left">
          <p className="font-mono font-semibold text-sm tracking-wide">
            {like.release.title}
          </p>

          <div>
            {like.release.artistCredit.map((ac, i) => (
              <p
                key={i}
                className="text-xs tracking-wide text-white/50"
              >
                {ac.name}{ac.joinphrase}
              </p>
            ))}
          </div>
        </div>

      </div>
    </button>

  )
}