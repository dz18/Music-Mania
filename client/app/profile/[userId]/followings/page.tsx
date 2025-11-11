'use client'

import Pagination from "@/app/components/profile/pagination";
import LoadingBox from "@/app/components/ui/loading/loadingBox";
import RefreshPage from "@/app/components/ui/RefreshPage";
import fetchFollowers from "@/app/hooks/api/profile/fetchFollowers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use } from "react";
export default function Followings ({
  params
} : {
  params: Promise<{userId: string}>
}) {

  const { userId } = use(params)
  const { results, follow, unfollow, loading, setPage, fetchFollows } = fetchFollowers(userId, true)
  const { data: session } = useSession()
  const router = useRouter()

  if (loading) {
    return (
      <div className="h-screen"> 
        <div className="flex flex-col gap-2 h-full min-h-0 p-4">
          <LoadingBox className="w-full h-8" />
          <LoadingBox className="w-1/2 h-8" />

          <div className="flex-1 min-h-0">
            <LoadingBox className="w-full h-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <RefreshPage
        func={fetchFollows}
        title="Followings Page"
        loading={loading}
        note="Error Fetching Followings"
      />
    ) 
  }

  return (
    <div>

      <p className="text-lg font-mono"><span className="font-bold">{results?.username}</span> Followings</p>

      {/* Results */}
      <section>
        <div className="mb-1">
          <span className="font-mono font-bold">Total: </span>
          <span className="font-mono text-teal-500 font-bold">{results?.total}</span>
        </div>
        {results?.follows?.length !== 0 ?
          results?.follows?.map((f, i) => (
            <div 
              key={i}
              className={`
                ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
                flex p-2 gap-2
              `}
            >
              <img src={f.following.avatar ?? '/default-avatar.jpg'} className="w-16 h-16 object-cover" />
              
              <div className="text-sm grow">
                <p className="font-mono font-bold hover:underline cursor-pointer" onClick={() => router.push(`/profile/${f.followingId}`)}>
                  {f.following.username}
                </p>
                <p className="text-gray-400">Follower since {new Date(f.createdAt).toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
              </div>

              {session &&
                session?.user.id !== f.followingId && 
                  <div className="flex items-center">
                    <button 
                      className={`
                        ${results.isFollowing[f.followingId] ? 
                          'text-white hover:bg-black/20 active:bg-black/40 border' : 
                          'text-black bg-white hover:bg-white/80 active:bg-white/60'
                        }
                        px-2 py-1 rounded w-24 font-mono text-sm cursor-pointer 
                      `}
                      onClick={() => results.isFollowing[f.followingId] ? unfollow(f.followingId) : follow(f.followingId)}
                    >
                      {results.isFollowing[f.followingId] ? 'unfollow' : 'follow'}
                    </button>
                  </div>
              }
              
              
              

            </div>
          ))
        :
          <div className="font-mono text-gray-500 text-lg">None :(</div>
        }
        
      </section>

      {results?.follows.length !== 0 &&
        <section>
          <Pagination setPage={setPage} results={results}/>
        </section>
      }
            

    </div>
  )
} 