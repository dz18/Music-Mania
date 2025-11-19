'use client'

import LoadingBox from "@/app/components/ui/loading/loadingBox";
import LoadingText from "@/app/components/ui/loading/LoadingText";
import Pagination from "@/app/components/ui/Pagination";
import RefreshPage from "@/app/components/ui/RefreshPage";
import usefetchFollowers from "@/app/hooks/api/profile/useFetchFollowers";
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

      <p className="text-lg font-mono"><span className="font-bold">{results?.data.username}</span> Followers</p>

      {/* Results */}
      <section>
        <div className="mb-1">
          <span className="font-mono font-bold">Total: </span>
          <span className="font-mono text-teal-500 font-bold">{results.count}</span>
        </div>
        {results?.data.follows.length !== 0 ? 
          results?.data.follows?.map((f, i) => (
            <div 
              key={i}
              className={`
                ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
                flex p-2 gap-2
              `}
            >
              <img src={f.follower.avatar ?? '/default-avatar.jpg'} className="w-16 h-16 object-cover" />
              
              <div className="text-sm grow">
                <p className="font-mono font-bold hover:underline cursor-pointer" onClick={() => router.push(`/profile/${f.followerId}`)}>
                  {f.follower.username}
                </p>
                <p className="text-gray-400">Follower since {new Date(f.createdAt).toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
              </div>

              {session &&
                session?.user.id !== f.followerId &&
                  <div className="flex items-center">
                    <button 
                      className={`
                        ${results.data.isFollowingMap[f.followerId] ? 
                          'text-white hover:bg-black/20 active:bg-black/40 border' : 
                          'text-black bg-white hover:bg-white/80 active:bg-white/60'
                        }
                        px-2 py-1 rounded w-24 font-mono text-sm cursor-pointer 
                      `}
                      onClick={() => results.data.isFollowingMap[f.followerId] ? unfollow(f.followerId) : follow(f.followerId)}
                    >
                      {results.data.isFollowingMap[f.followerId] ? 'unfollow' : 'follow'}
                    </button>
                  </div>
              }
              

            </div>
          ))
        :
          <div className="font-mono text-gray-500 text-lg">None :(</div>
        }
        
      </section>

      <section>
        <Pagination data={results} fetchData={fetchFollows}/> 
      </section>

    </div>
  )
} 