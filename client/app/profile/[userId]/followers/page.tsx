'use client'

import LoadingBox from "@/app/components/ui/loading/loadingBox";
import LoadingText from "@/app/components/ui/loading/LoadingText";
import Pagination from "@/app/components/ui/Pagination";
import RefreshPage from "@/app/components/ui/RefreshPage";
import usefetchFollowers from "@/app/hooks/api/profile/useFetchFollowers";
import { timeAgo } from "@/app/hooks/timeAgo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use } from "react";
export default function Followers ({
  params
} : {
  params: Promise<{userId: string}>
}) {

  const { userId } = use(params)
  const { results, follow, unfollow, loading, fetchFollows } = usefetchFollowers(userId)
  const {data: session} = useSession()
  const router = useRouter()

  if (loading) {
    return (
      <div className="h-screen"> 
        <div className="flex flex-col gap-2 h-full min-h-0 p-4">
          <LoadingText text="Loading Followers"/>

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
        func={() => fetchFollows(1)}
        title="Followers Page"
        loading={loading}
        note="Error Fetching Followers"
      />
    ) 
  }

  return (
    <div>

      <div className="text-lg font-mono mb-2">
        <p className="font-bold">Followers</p>
        <p className="text-sm text-gray-500">{results?.data.username}</p>
      </div>

      {/* Results */}
      <section>
        <div className="mb-1">
          <span className="font-mono font-bold">Total: </span>
          <span className="font-mono text-teal-500 font-bold">{results.count}</span>
        </div>
        <div
          className="rounded-lg overflow-hidden border border-gray-500"
        >
          {results?.data.follows.length !== 0 ? 
            results?.data.follows?.map((f, i) => (
              <div 
                key={i}
                className={`
                  ${i % 2 === 0 ? 'bg-surface' : ''}
                  flex px-4 py-2 gap-2 border-b border-white/5
                `}
              >
                <img src={f.follower.avatar ?? '/default-avatar.jpg'} className="w-16 h-16 object-cover border border-gray-500" />
                
                <div className="text-sm grow">
                  <p className="font-mono font-bold hover:underline cursor-pointer" onClick={() => router.push(`/profile/${f.followerId}`)}>
                    {f.follower.username}
                  </p>
                  <p className="text-gray-400">Since {timeAgo(f.createdAt)}</p>
                </div>

                {session &&
                  session?.user.id !== f.followerId &&
                    <div className="flex items-center font-mono text-sm">

                      {results.data.isFollowingMap[f.followerId] ?
                        <button 
                          className={`
                            group border px-2 py-1 rounded interactive-button w-25 hover:bg-red-950 hover:border-red-500
                          `}
                          onClick={() => unfollow(f.followerId)}
                        >
                          <span className="block group-hover:hidden ">Following</span>
                          <span className="hidden group-hover:block group-hover:text-red-500">Unfollow</span>
                        </button>
                      :
                        <button 
                          className={`
                            group border px-2 py-1 rounded interactive-button w-25 bg-white text-black interactive-light
                          `}
                          onClick={() => follow(f.followerId)}
                        >
                          <span className="block">Follow</span>
                        </button>
                      }
                    </div>
                }
                

              </div>
            ))
          :
            <div className="font-mono text-gray-500 text-lg">None :(</div>
          }
        </div>
        
        
      </section>

      {results.count <= 0 && <Pagination data={results} fetchData={fetchFollows}/> }
        

    </div>
  )
} 