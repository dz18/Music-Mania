'use client'

import Pagination from "@/app/components/profile/pagination";
import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import Nav from "@/app/components/ui/NavigationBar";
import fetchFollowers from "@/app/hooks/api/profile/fetchFollowers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use } from "react";
export default function Followings ({
  params
} : {
  params: Promise<{userId: string}>
}) {

  const { userId } = use(params)
  const { results, follow, unfollow, loading, setPage } = fetchFollowers(userId, true)
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div>
      <Nav/>
      <Container>
        <div className="min-h-screen mt-20 mb-10 flex flex-col gap-4">

          <p className="text-lg font-mono font-bold">Followings</p>

          {/* Results */}
          <section>
            <div className="mb-1">
              <span className="font-mono font-bold">Total: </span>
              <span className="font-mono text-teal-500 font-bold">{results?.total}</span>
            </div>
            {results?.follows?.map((f, i) => (
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

                {session?.user.id !== f.followingId && 
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
            ))}
          </section>

          <section>
            <Pagination setPage={setPage} results={results}/>
          </section>

        </div>
      </Container>
      <Footer/>
    </div>
  )
} 