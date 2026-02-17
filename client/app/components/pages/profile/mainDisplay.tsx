import useIsFollowing from "@/app/hooks/api/profile/useFollow";
import { CalendarDays, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

  const { data: session, status } = useSession()
  const router = useRouter()

  const isOwnProfile = status === 'authenticated' && session?.user.id === profile.id
  const isFollowing = profile.isFollowing

  return (

    <div className="flex gap-4">

      <img 
        src={`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${profile.id}?v=${Date.now()}`} 
        alt="avatar"
        className="w-50 h-50 object-cover"
        onError={e => { e.currentTarget.src = "/default-avatar.jpg"}}
      />

      <div className="flex flex-col gap-2">

        <p className="font-mono text-xl font-bold">{profile?.username}</p>

        <div>
          <p className="text-sm flex items-center gap-1 text-gray-500"> 
            <CalendarDays size={18}/> 
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
          {isOwnProfile ? (
            <Link
              className="font-semibold text-sm text-teal-500 hover:underline"
              href={`/profile/${profile.id}/edit`}
            >
              Edit Profile
            </Link>
          ) : (
            status !== 'unauthenticated' && (
              <button
                className={`
                  relative px-2 py-1 border rounded font-mono
                  flex items-center justify-center
                  interactive-button font-semibold text-center
                  ${
                    profile.isFollowing
                      ? 'bg-transparent text-white border-white/30 hover:border-red-500 hover:bg-red-950 group'
                      : 'bg-white text-black interactive-light'
                  }
                `}
                onClick={profile.isFollowing ? unfollow : follow}
                disabled={followLoad}
                aria-busy={followLoad}
              >
                {followLoad && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Loader size={18} className="animate-spin" />
                  </span>
                )}

                <span className={`${followLoad ? 'opacity-0' : 'opacity-100'} text-sm`}>
                  {profile.isFollowing ? (
                    <span className="relative">
                      <span className="block group-hover:hidden">Following</span>
                      <span className="hidden group-hover:block text-red-400">
                        Unfollow
                      </span>
                    </span>
                  ) : (
                    'Follow'
                  )}
                </span>
              </button>
            )
          )}

        
      </div>
    </div>
  )
}