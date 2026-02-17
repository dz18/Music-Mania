'use client'

import ArtistReviews from "@/app/components/pages/profile/artistReviews"
import ReleaseReviews from "@/app/components/pages/profile/releaseReviews"
import SongReviews from "@/app/components/pages/profile/songReviews"
import MainDisplay from "@/app/components/pages/profile/mainDisplay"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import RefreshPage from "@/app/components/ui/RefreshPage"
import LoadingText from "@/app/components/ui/loading/LoadingText"
import useFetchProfile from "@/app/hooks/api/profile/useFetchProfile"
import StarStatistics from "@/app/components/ui/starStatistics"
import ProfileLikes from "@/app/components/pages/profile/ProfileLikes"

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
    starStats
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

      <section className="flex gap-4">
        <MainDisplay 
          profile={profile}
          follow={follow}
          unfollow={unfollow}
          followLoad={followLoad}
        />
      </section>

      {profile?.aboutMe &&
        <section
          className="rounded-lg border-gray-500 border flex flex-col overflow-hidden"
        >
          <p 
            className="font-mono font-semibold px-4 py-2 bg-surface-elevated border-b border-white/5 text-sm"
          >
            About Me
          </p>
          <div className="px-4 py-2 text-sm bg-surface" style={{ whiteSpace: 'pre-line' }}>
            <p>{profile.aboutMe}</p>
          </div>
        </section>
      }


      <section className="flex flex-col gap-2">
      
        <div className="flex gap-2 font-semibold text-sm">
          {tabs.map(tab => (
            <button
              key={tab.label}
              className={`
                py-1 px-2 rounded
                ${selected === tab.key ? 'bg-teal-950 border border-teal-300 text-teal-300' : 'bg-surface-elevated border border-white/5'}
                ${profile?.[tab.key] === 0 
                  ? "opacity-60"
                  : selected !== tab.key 
                    && 'interactive-button interactive-dark'
                }
              `}
              onClick={() => setSelected(tab.key)}
              disabled={profile?.[tab.key] === 0 || selected === tab.key || loading}
            >
              {tab.label}{' '}
              {tab.key !== 'starStats' &&
                <span className="opacity-60">
                  {profile?.[tab.key]}
                </span>
              }
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {starStats && 
            <div
              className="border-gray-500"
            >
              <StarStatistics stats={starStats}/>
            </div>
          }

          {tabLoad ?(
            <div
              className="flex flex-col gap-2"
            >
              <LoadingBox className="w-full h-40"/>
              <LoadingBox className="w-full h-40"/>
              <LoadingBox className="w-full h-40"/>
            </div>
          ):(
            <>
              {selected === 'artistReviews' && <ArtistReviews data={artistReviews} fetchData={fetchTab} />}
              {selected === 'releaseReviews' && <ReleaseReviews data={releaseReviews} fetchData={fetchTab}/>}
              {selected === 'songReviews' && <SongReviews data={songReviews} fetchData={fetchTab}/>}
            </>
          )}
        </div>

      </section>

      <section
        className="rounded-lg border border-gray-500 overflow-hidden"
      >
        <p className="text-sm font-mono font-bold tracking-wider px-4 py-2 bg-surface-elevated border-b border-white/5">Likes</p>
        <ProfileLikes profileId={userId}/>
      </section>

    </div>
  )
}