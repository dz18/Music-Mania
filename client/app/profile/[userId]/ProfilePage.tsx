'use client'

import { use } from "react"
import ArtistReviews from "@/app/components/pages/profile/artistReviews"
import ReleaseReviews from "@/app/components/pages/profile/releaseReviews"
import SongReviews from "@/app/components/pages/profile/songReviews"
import Statistics from "@/app/components/ui/statistics"
import DisplayFavorites from "@/app/components/pages/profile/displayFavorites"
import MainDisplay from "@/app/components/pages/profile/mainDisplay"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import RefreshPage from "@/app/components/ui/RefreshPage"
import LoadingText from "@/app/components/ui/loading/LoadingText"
import useFetchProfile from "@/app/hooks/api/profile/useFetchProfile"
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar"
import ProfileFavorites from "@/app/components/pages/profile/ProfileFavorites"


export default function ProfilePage ({
  userId,
  star
} : {
  userId: string,
  star: number | null
}) {

  const { 
    profile, loading, error, fetchTab,
    fetchProfilePage, tabs, selected, tabLoad,
    setSelected, follow, unfollow, followLoad,
    artistReviews, releaseReviews, songReviews,
  } = useFetchProfile(userId, star)

  if (loading) {
    return (
      <div className="flex flex-col gap-4">

        <section className="flex gap-2">
          <LoadingBox className="w-50 h-50 rounded-md" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">

              
              <LoadingText text="Searching for Profile" />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2">
                <LoadingBox className="w-24 h-4"/>
                <LoadingBox className="w-12 h-4"/>
              </div>
              <div className="flex flex-col gap-2">
                <LoadingBox className="w-24 h-4"/>
                <LoadingBox className="w-12 h-4"/>
              </div>
            </div>
            <LoadingBox className="w-50 h-8"/>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <LoadingBox className="w-50 h-4"/>
          <LoadingBox className="w-full h-16"/>
        </section>

        <section className="flex flex-col gap-2">
          <LoadingBox className="w-50 h-4"/>
          <LoadingBox className="w-full h-50"/>
        </section>

        <section className="flex flex-col gap-2">
            <LoadingBox className="w-50 h-4"/>
            <div className="flex">
              <LoadingBox className="w-full h-10"/>
            </div>
            <div className="flex gap-2">
                <LoadingBox className="w-full h-50"/>
                <LoadingBox className="w-full h-50"/>
                <LoadingBox className="w-full h-50"/>
            </div>
        </section>

      </div>
    )
  }

  if (!profile) {
    return (
      <RefreshPage
        func={fetchProfilePage}
        title="Profile Page"
        loading={loading}
        note={error ?? "Unknown Error Occurred. Try Again."}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Main Section */}
      <section className="flex gap-4">
        <MainDisplay 
          profile={profile}
          follow={follow}
          unfollow={unfollow}
          followLoad={followLoad}
        />
      </section>

      {/* About Me */}
      {profile?.aboutMe &&
        <section
          className="bg-surface p-2"
        >
          <p className="font-mono font-bold">About Me</p>
          <div className="py-2 border-t border-b border-gray-500 my-1">
            <p>{profile.aboutMe}</p>
          </div>
        </section>
      }

      {/* Table */}
      <section
        className="bg-surface p-2 border-white/5 border px-4 py-2 rounded-xl"
      >
        
        <div className="font-mono  flex justify-between text-sm items-end">
          <span className="font-bold text-lg tracking-wider">Ratings</span>
          <span className="text-gray-500">{profile?.totalReviewCount} total reviews</span>
        </div>

        <div className="py-2 border-t border-b border-white/5 my-2">
          <div className="flex gap-2 text-sm font-bold">
            {tabs.map(tab => (
              <button
                key={tab.label}
                className={`
                  py-1 px-2 cursor-pointer 
                  ${selected === tab.key ? 'bg-teal-950 border border-teal-300 text-teal-300' : 'bg-surface-elevated border border-white/5 interactive-button interactive-dark'}
                  disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-default rounded
                `}
                onClick={() => setSelected(tab.key)}
                disabled={profile?.[tab.key] === 0}
              >
                {tab.label}{' '}
                {tab.key !== 'starStats' &&
                  <span className="text-teal-500">
                    {profile?.[tab.key]}
                  </span>
                }
              </button>
            ))}
          </div>
        </div>

        <div>
          {tabLoad ?(
            <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
          ):(
            <>
              {selected === 'starStats' && <Statistics stats={profile.starStats} filter={false}/>}
              {selected === 'artistReviews' && <ArtistReviews data={artistReviews} fetchData={fetchTab} />}
              {selected === 'releaseReviews' && <ReleaseReviews data={releaseReviews} fetchData={fetchTab}/>}
              {selected === 'songReviews' && <SongReviews data={songReviews} fetchData={fetchTab}/>}
            </>
          )}
        </div>

      </section>

      {/* Display Favorites */}
      {/* <section
        className="bg-surface px-4 py-2 rounded-xl border border-white/5"
      >
        <p className="font-mono font-bold">Favorites</p>
        <DisplayFavorites profile={profile}/>
      </section> */}

      <section
        className="bg-surface px-4  py-2 rounded-xl border border-white/5"
      >
        <p className="text-lg font-mono font-bold mb-2 tracking-wider">Favorites</p>
        <ProfileFavorites profileId={userId}/>
      </section>

    </div>
  )
}