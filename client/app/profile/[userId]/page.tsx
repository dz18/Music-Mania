'use client'

import Footer from "@/app/components/ui/Footer"
import Nav from "@/app/components/ui/NavigationBar"
import Container from "@/app/components/ui/Container"
import { use, useState } from "react"
import { useSession } from "next-auth/react"
import fetchProfile from "@/app/hooks/api/profile/fetchProfile"
import ArtistReviews from "@/app/components/profile/artistReviews"
import ReleaseReviews from "@/app/components/profile/releaseReviews"
import SongReviews from "@/app/components/profile/songReviews"
import Statistics from "@/app/components/profile/statistics"
import { useRouter } from "next/navigation"
import DisplayFavorites from "@/app/components/profile/displayFavorites"
import MainDisplay from "@/app/components/profile/mainDisplay"


export default function Profile ({
  params
} : {
  params: Promise<{userId: string}>
}) {


  const { userId } = use(params)
  const { profile, loading, error} = fetchProfile(userId)
  const { data: session } = useSession()
  const router = useRouter()
  const [selected, setSelected] = useState('Statistics')

  type ReviewKeys = keyof Pick<UserProfile, 'artistReviews' | 'releaseReviews' | 'songReviews'>
  const tabs : {label: string, key?: ReviewKeys}[] = [
    {label: 'Statistics'},
    {label: 'Artist Reviews', key: 'artistReviews' },
    {label: 'Release Reviews', key: 'releaseReviews' },
    {label: 'Song Reviews', key: 'songReviews' },
  ]

  if (!profile) return

  return (
    <div>
      <Nav/>
      <Container>
        <div className="min-h-screen mt-20 mb-10 flex flex-col gap-4">

          {/* Main Section */}
          <section className="flex gap-4">
            <MainDisplay profile={profile}/>
          </section>

          {/* About Me */}
          {profile?.aboutMe &&
            <section>
              <p className="font-mono font-bold">About Me</p>
              <div className="p-2 border-t border-b my-1">
                <p>{profile.aboutMe}</p>
              </div>
            </section>
          }

          {/* Table */}
          <section>
            <p className="font-mono font-bold">
              Ratings: <span className="text-teal-500">{profile?.totalReviewCount}</span>
            </p>
            <div className="p-2 border-t border-b my-1">
              <div className="flex gap-2 text-sm font-bold">
                {tabs.map(tab => (
                  <button
                    key={tab.label}
                    className={`
                      py-1 px-2 cursor-pointer 
                      ${selected === tab.label ? 'bg-teal-800' : 'bg-gray-800 hover:bg-gray-700'}
                      disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-default
                    `}
                    onClick={() => setSelected(tab.label)}
                    disabled={typeof tab.key === "string" && profile?.[tab.key]?.length === 0}
                  >
                    {tab.label}
                    {tab.key && (
                      <>
                        {' '}
                        [<span className="text-teal-500">
                          {profile?.[tab.key]?.length ?? 0}
                        </span>]
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 pb-2 border-b">
              {selected === 'Statistics' && <Statistics stats={profile.starStats}/>}
              {selected === 'Artist Reviews' && <ArtistReviews profile={profile}/>}
              {selected === 'Release Reviews' && <ReleaseReviews profile={profile}/>}
              {selected === 'Song Reviews' && <SongReviews profile={profile}/>}
            </div>

          </section>

          {/* Display Favorites */}
          <section>
            <p className="font-mono font-bold">Favorites</p>
            <DisplayFavorites profile={profile}/>
          </section>

        </div>
      </Container>
      <Footer/>
    </div>
  )
}