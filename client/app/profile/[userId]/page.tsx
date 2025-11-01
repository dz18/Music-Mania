'use client'

import Footer from "@/app/components/ui/Footer"
import Nav from "@/app/components/ui/NavigationBar"
import Container from "@/app/components/ui/Container"
import { use, useState } from "react"
import { CalendarDays } from "lucide-react"
import { useSession } from "next-auth/react"
import fetchProfile from "@/app/hooks/api/profile/fetchProfile"
import ArtistReviews from "@/app/components/profile/artistReviews"
import ReleaseReviews from "@/app/components/profile/releaseReviews"
import SongReviews from "@/app/components/profile/songReviews"
import Statistics from "@/app/components/profile/statistics"
import { useRouter } from "next/navigation"


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
        <div className="min-h-screen mt-20 mb-10 flex flex-col gap-8">

          {/* Main Section */}
          <section className="flex gap-4">
            <img 
              src={profile?.avatar || "/default-avatar.jpg"} 
              alt="avatar"
              className="w-50 h-50"
            />
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-xl font-bold">{profile?.username}</p>
                <p className="text-sm flex items-center gap-1"> 
                  <CalendarDays/> 
                  Joined {profile ? new Date(profile?.createdAt).toLocaleDateString() : null}
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="font-bold">Followers</p>
                  <p>{20}</p>
                </div>
                <div>
                  <p className="font-bold">Following</p>
                  <p>{30}</p>
                </div>
                <div>
                  <p className="font-bold">Reviews</p>
                  <p>{40}</p>
                </div>
              </div>
              {session?.user.id === userId && 
                <button className="border rounded cursor-pointer">Edit Profile</button> 
              }
            </div>
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


          <section>
            <p className="font-mono font-bold">
              Ratings: <span className="text-teal-500">{profile?.totalReviewCount}</span>
            </p>
            <div className="p-2 border-t border-b my-1">
              <div className="flex gap-2 text-sm font-bold">
                {tabs.map(tab => (
                  <div
                    key={tab.label}
                    className={`py-1 px-2 cursor-pointer ${
                      selected === tab.label ? 'bg-teal-800' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelected(tab.label)}
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
                  </div>
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
            <div>
              <div className="flex divide-x justify-between font-bold">
                <div className="flex w-full text-sm border-y-1 p-1">
                  <p className="font-mono font-bold text-center w-full">
                    Artists 
                    <span className="ml-2 text-xs text-teal-500 ">
                      {profile?.favArtists.length}
                    </span>
                  </p>
                </div>
                <div className="flex w-full text-sm border-y-1 p-1">
                  <p className="font-mono font-bold text-center w-full">
                    Releases 
                    <span className="ml-2 text-xs text-teal-500 ">
                      {profile?.favReleases.length}
                    </span>
                  </p>
                </div>
                <div className="flex w-full text-sm border-y-1 p-1">
                  <p className="font-mono font-bold text-center w-full">
                    Songs 
                    <span className="ml-2 text-xs text-teal-500 ">
                      {profile?.favSongs.length}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex divide-x justify-between">
                <div className="flex w-full text-sm p-2 flex-col ">
                  {profile?.favArtists.length !== 0 ?
                    profile?.favArtists.map((artist, i) => (
                      <div className="my-1" key={i}>
                        <div className="flex justify-between font-bold">
                          <span className="hover:underline cursor-pointer" onClick={() => router.push(`/release/${artist.artistId}`)}>
                            {artist.artist.name}
                          </span>
                          <span className="font-medium ml-1 text-gray-500">
                            since {new Date(artist.since).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  :
                    <p className="font-mono text-gray-500 text-center">None :(</p>
                  }
                </div>
                <div className="flex w-full text-sm p-2 flex-col">
                  {profile?.favReleases.length !== 0 ? 
                    profile?.favReleases.map((release, i) => (
                      <div className="my-1" key={i}>
                        <p className="hover:underline cursor-pointer font-bold" onClick={() => router.push(`/release/${release.releaseId}`)}>
                          {release.release.title}
                        </p>
                        <p className="font-medium text-gray-500">
                          {release.release.artistCredit.map(a => `${a.name}${a.joinphrase}`)}
                        </p>
                      </div>
                    ))
                    :
                    <p className="font-mono text-gray-500 text-center">None :(</p>
                  }
                </div>
                <div className="flex w-full text-sm p-2 flex-col">
                  {profile?.favSongs.length !== 0 ?
                    profile?.favSongs.map((song, i) => (
                      <div className="my-1" key={i}>
                        <p className="hover:underline cursor-pointer font-bold"  onClick={() => router.push(`/release/${song.songId}`)}>
                          {song.song.title}
                        </p>
                        <p className="font-medium text-gray-500">
                          {song.song.artistCredit.map(a => `${a.name}${a.joinphrase}`)}
                        </p>
                      </div>
                    ))
                  :
                    <p className="font-mono text-gray-500 text-center">None :(</p>
                  }
                </div>
              </div>
            </div>
            




          </section>

          

        </div>
      </Container>
      <Footer/>
    </div>
  )
}