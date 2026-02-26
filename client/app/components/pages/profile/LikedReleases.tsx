import { LikedRelease } from "@/app/lib/types/profile"
import { TriangleAlert } from "lucide-react"
import LikeReleaseCard from "./LikedReleaseCard"

export default function LikedReleases ({
  likes
} : {
  likes: LikedRelease[] | null
}) {

  if (likes && likes?.length <= 0) {
    return (
      <p
        className="text-sm font-mono tracking-wide text-gray-500 flex gap-2 items-center px-4 py-2"
      >
        <TriangleAlert className="" size={18}/> No Favorite Artists Yet
      </p> 
    )
  }

  return (
    <ul className="list-none px-4 py-2">
      <li className="flex items-center gap-2 flex-wrap">
        {likes?.map((l, i) => (
          <LikeReleaseCard like={l} key={i}/>
        ))}
      </li>
    </ul>
  )
}