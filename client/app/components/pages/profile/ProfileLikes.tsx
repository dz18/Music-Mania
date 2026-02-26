'use client'

import { LikeTabs, LikeTypes } from "@/app/lib/types/favorites"
import { JSX, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import IndeterminateLoadingBar from "../../ui/loading/IndeterminateLoadingBar"
import LikedArtists from "./LikedArtists"
import LikedReleases from "./LikedReleases"
import LikedSongs from "./LikedSongs"
import { LikedArtist, LikedRelease, LikedSong } from "@/app/lib/types/profile"
import { fetchLikes } from "@/app/lib/api/profile"

export default function ProfileLikes ({
  profileId
} : {
  profileId: string
}) {
  const [active, setActive] = useState<LikeTypes>('artists')

  const tabs: LikeTabs = [
    { label: 'Artists', value: 'artists', count: 0 },
    { label: 'Releases', value: 'releases', count: 0 },
    { label: 'Songs', value: 'songs', count: 0 },
  ]

  const { data, isLoading, error } = useQuery({
    queryKey: ['likes', profileId, active],
    queryFn: () => fetchLikes(profileId, active),
    placeholderData: (prev) => prev
  })

  const likedArtists: LikedArtist[] | null = active === 'artists' 
    ? data?.userLikedArtist ?? null 
    : null
  const likedReleases: LikedRelease[] | null = active === 'releases' 
    ? data?.userLikedRelease ?? null 
    : null
  const likedSongs: LikedSong[] | null = active === 'songs' 
    ? data?.userLikedSong ?? null 
    : null

  const updatedTabs = tabs.map(tab => ({
    ...tab,
    count: tab.value === 'artists'
      ? data?._count.userLikedArtist ?? 0
      : tab.value === 'releases'
      ? data?._count.userLikedRelease ?? 0
      : data?._count.userLikedSong ?? 0
  }))

  const LikeComponents: Record<LikeTypes, JSX.Element> = {
    artists: <LikedArtists likes={likedArtists} />,
    releases: <LikedReleases likes={likedReleases} />,
    songs: <LikedSongs likes={likedSongs} />,
  }

  return (
    <div>
      <ul
        className="list-none flex gap-2 border-b border-t border-white/5 px-4 py-2 bg-surface"
      >
        {updatedTabs.map(t => 
          <li key={t.label}>
            <button
              onClick={() => setActive(t.value)}
              disabled={t.value === active}
              className={`
                px-2 py-1 border text-sm flex gap-1 rounded
                ${t.value === active
                  ? "border-teal-300 bg-teal-950 text-teal-300 cursor-default"
                  : "border-white/5 bg-surface-elevated interactive-button interactive-dark"
                }
              `}
            >
              <span className="font-semibold">{t.label}</span>
              <span className="opacity-40 font-semibold">{t.count}</span>
            </button>
          </li>
        )}
      </ul>

      {isLoading ?
        <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500" />
      :
        LikeComponents[active]
      }

      {error && <div className="text-red-500 mt-2">Error fetching likes</div>}
    </div>
  )
}