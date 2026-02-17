import { FavoritesResponse, LikeTabs, LikeTypes } from "@/app/lib/types/favorites"
import axios from "axios"
import { JSX, useEffect, useState } from "react"
import IndeterminateLoadingBar from "../../ui/loading/IndeterminateLoadingBar"
import LikedArtists from "./LikedArtists"
import LikedReleases from "./LikedReleases"
import LikedSongs from "./LikedSongs"

export default function ProfileLikes ({
  profileId
} : {
  profileId: string
}) {

  const [active, setActive] = useState<LikeTypes>('artists')
  const [tabs, setTabs] = useState<LikeTabs>([
    {label: 'Artists', value: 'artists', count: 0},
    {label: 'Releases', value: 'releases',  count: 0},
    {label: 'Songs', value: 'songs',  count: 0},
  ])
  const [likedArtists, setLikedArtists] = useState<LikedArtist[] | null>(null)
  const [likedReleases, setLikedReleases] = useState<LikedRelease[] | null>(null)
  const [likedSongs, setLikedSongs] = useState<LikedSong[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchLikes = async () => {
    try {
      setLoading(true)
      const res = await axios.get<FavoritesResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/likes`, {
        params: { id: profileId, active }
      })

      const data = res.data
      console.log(data)
      if (active === 'artists') setLikedArtists(data.userLikedArtist)
      if (active === 'releases') setLikedReleases(data.userLikedRelease) 
      if (active === 'songs') setLikedSongs(data.userLikedSong) 

      setTabs(prev =>
        prev.map(tab => ({
          ...tab,
          count:
            tab.value === 'artists'
              ? data._count.userLikedArtist
              : tab.value === 'releases'
              ? data._count.userLikedRelease
              : data._count.userLikedSong,
        }))
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error ?? 'Unknown Error')
      }
      console.error(error)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchLikes()
  }, [profileId, active])

  const LikeComponents: Record<LikeTypes, JSX.Element> = {
    artists: <LikedArtists likes={likedArtists}/>,
    releases: <LikedReleases likes={likedReleases}/>,
    songs: <LikedSongs likes={likedSongs}/>,
  }

  return (
    <div>
      <ul
        className="list-none flex gap-2 border-b border-t border-white/5 px-4 py-2 bg-surface"
      >
        {tabs.map(t => 
          <li
            key={t.label}
          >
            <button
              onClick={() => setActive(t.value)}
              disabled={t.label.toLowerCase() === active}
              className={`
                px-2 py-1 border text-sm flex gap-1 rounded
                ${t.label.toLowerCase() === active
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

      {loading ?
        <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
      :
        LikeComponents[active]
      }
    </div>
  )
}