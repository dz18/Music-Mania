import useIsFollowing from "@/app/hooks/api/profile/useFollow";
import { CalendarDays, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export default function MainDisplay ({
  profile,
  follow,
  unfollow,
  followLoad,
} : {
  profile: UserProfile, 
  follow: () => void
  unfollow: () => void
  followLoad: boolean
}) {

  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="flex gap-4">
      <img 
        src={profile?.avatar || "/default-avatar.jpg"} 
        alt="avatar"
        className="w-50 h-50"
      />
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xl font-bold">{profile?.username}</p>
        <div>
          <p className="text-sm flex items-center gap-1 text-gray-500"> 
            <CalendarDays/> 
            Member since {profile ? new Date(profile?.createdAt).toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric'}) : null}
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="font-bold cursor-pointer hover:underline" onClick={() => router.push(`/profile/${profile.id}/followers`)}>
              Followers
            </p>
            <p>{profile.followers}</p>
          </div>
          <div>
            <p className="font-bold cursor-pointer hover:underline" onClick={() => router.push(`/profile/${profile.id}/followings`)}>Following</p>
            <p>{profile.following}</p>
          </div>
        </div>
        {session &&
          session?.user.id === profile.id ? (
            <button className="border rounded cursor-pointer">Edit Profile</button> 
          ) : ( 
            <button 
              className={`
                ${profile.isFollowing ? 'bg-transparent hover:bg-black/80 active:bg-black/60' : 'bg-white text-black hover:bg-white/80 active:bg-white/60'}
                px-2 py-1 border rounded cursor-pointer  font-mono flex items-center justify-center gap-2`
              }
              onClick={profile.isFollowing ? unfollow : follow}
              disabled={followLoad}
            >
              {profile.isFollowing ? 'Unfollow' : 'Follow'}
              {followLoad &&
                <Loader size={18} className="animate-spin"/>
              }
            </button>
          )
        }
      </div>
    </div>
  )
}