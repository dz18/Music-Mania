'use client'

import LoadingBox from "@/app/components/ui/loading/loadingBox";
import LoadingText from "@/app/components/ui/loading/LoadingText";
import Pagination from "@/app/components/ui/Pagination";
import RefreshPage from "@/app/components/ui/RefreshPage";
import usefetchFollowers from "@/app/hooks/api/profile/useFetchFollowers";
import { use } from "react";
import { IndividualFollow } from "./IndividualFollow";

export default function Followers ({
  params
} : {
  params: Promise<{userId: string}>
}) {

  const { userId } = use(params)
  const { results, follow, unfollow, loading, refetch, page, goToPage } = usefetchFollowers(userId)

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
        func={async () => { await refetch() }}
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
              <IndividualFollow 
                key={f.id}
                follower={f} 
                isFollowingMap={results.data.isFollowingMap}
                unfollow={unfollow}
                follow={follow}
                index={i}
              />            
            ))
          :
            <div className="font-mono text-gray-500 text-lg">None :(</div>
          }
        </div>
        
        
      </section>

      {results?.pages > 1 && 
        <Pagination 
          currentPage={results.currentPage}
          totalPages={results.pages}
          onPageChange={goToPage}
        /> 
      }
        

    </div>
  )
} 