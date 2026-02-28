import { timeAgo } from "@/app/hooks/timeAgo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IndividualFollowing ({
  following, isFollowingMap, follow, unfollow, index
} : {
  following:  {
    createdAt: Date;
    follower: {
        age: number;
        createdAt: Date;
        id: string;
        role: string;
        updatedAt: string;
        username: string;
    };
    following: {
        age: number;
        avatar: string;
        createdAt: Date;
        id: string;
        role: string;
        updatedAt: string;
        username: string;
    };
    followerId: string;
    followingId: string;
    id: string;
  }
  isFollowingMap: Record<string, boolean>
  follow: (id: string) => Promise<void>
  unfollow: (id: string) => Promise<void>
  index: number
}) {

  const { data: session } = useSession()
  const router = useRouter()
  
  const defaultAvatar = '/default-avatar.jpg'
  const initialAvatar = following.following.id
    ? `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${following.following.id}`
    : defaultAvatar
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar)

  return (
    <div 
      className={`
        ${index % 2 === 0 ? 'bg-surface' : ''}
        flex p-2 gap-2 border-b border-white/5
      `}
    >
      <img 
        src={avatarUrl} 
        className="w-16 h-16 object-cover border border-gray-500" 
        alt={`${following.following.username} avatar`}
        loading="lazy"
        onError={() => setAvatarUrl(defaultAvatar)}
      />
      
      <div className="text-sm grow">
        <p className="font-mono font-bold hover:underline cursor-pointer" onClick={() => router.push(`/profile/${following.followingId}`)}>
          {following.following.username}
        </p>
        <p className="text-gray-400">Following since {timeAgo(following.createdAt)}</p>
      </div>

      {session &&
        session?.user.id !== following.followingId && 
          <div className="flex items-center">
            <button 
              className={`
                ${isFollowingMap[following.followingId] ? 
                  'text-white hover:bg-red-950 hover:border-red-500 hover:text-red-500' : 
                  'text-black bg-white border-transparent hover:bg-teal-950 hover:text-teal-300 hover:border-teal-300'
                }
                px-2 py-1 rounded w-24 font-mono text-sm group interactive-button border 
              `}
              onClick={() => isFollowingMap[following.followingId] ? unfollow(following.followingId) : follow(following.followingId)}
            >
              {isFollowingMap[following.followingId] ? 
                <>
                  <span className="block group-hover:hidden">Following</span>
                  <span className="hidden group-hover:block">Unfollow</span>
                </>
              : 
                'Follow'
              }
            </button>
          </div>
      }
    </div>
  )
}