import useIsFollowing from "@/app/hooks/api/profile/useFollow";
import { CalendarDays } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MainDisplay ({profile} : {profile: UserProfile}) {

  const { data: session } = useSession()
  const router = useRouter()
  const { 
    following, 
    follow, 
    unfollow,
    followerCount,
    followingCount
  } = useIsFollowing(profile.id)

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
            <p>{followerCount}</p>
          </div>
          <div>
            <p className="font-bold cursor-pointer hover:underline" onClick={() => router.push(`/profile/${profile.id}/followings`)}>Following</p>
            <p>{followingCount}</p>
          </div>
        </div>
        {session &&
          session?.user.id === profile.id ? (
            <button 
              className="border rounded cursor-pointer"
              onClick={() => router.push(`/profile/${profile.id}/edit`)}
            >
              Edit Profile
            </button> 
          ) : ( 
            <button 
              className="border rounded cursor-pointer hover:bg-white/10 active:bg-white/20"
              onClick={following ? unfollow : follow}
            >
              {following ? 'Unfollow' : 'Follow'}
            </button>
          )
        }
      </div>
    </div>
  )
}