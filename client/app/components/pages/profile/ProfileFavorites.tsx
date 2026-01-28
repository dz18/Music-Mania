import { FavoritesResponse, FavoriteTabs, FavoriteTypes } from "@/app/lib/types/favorites"
import axios from "axios"
import { JSX, useEffect, useState } from "react"
import FavoriteArtists from "./FavoriteArtists"
import FavoriteReleases from "./FavoriteReleases"
import FavoriteSongs from "./FavoriteSongs"
import IndeterminateLoadingBar from "../../ui/loading/IndeterminateLoadingBar"

export default function ProfileFavorites ({
  profileId
} : {
  profileId: string
}) {

  const [active, setActive] = useState<FavoriteTypes>('artists')
  const [tabs, setTabs] = useState<FavoriteTabs>([
    {label: 'Artists', value: 'artists', count: 0},
    {label: 'Releases', value: 'releases',  count: 0},
    {label: 'Songs', value: 'songs',  count: 0},
  ])
  const [favoriteArtists, setFavoriteArtists] = useState<FavArtist[] | null>(null)
  const [favoriteReleases, setFavoriteReleases] = useState<FavRelease[] | null>(null)
  const [favoriteSongs, setFavoriteSongs] = useState<FavSong[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)
        const res = await axios.get<FavoritesResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/favorites`, {
          params: { id: profileId, active }
        })

        const data = res.data
        console.log(data)
        if (active === 'artists') setFavoriteArtists(data.favArtists)
        if (active === 'releases') setFavoriteReleases(data.favReleases) 
        if (active === 'songs') setFavoriteSongs(data.favSongs) 

        setTabs(prev =>
          prev.map(tab => ({
            ...tab,
            count:
              tab.value === 'artists'
                ? data._count.favArtists
                : tab.value === 'releases'
                ? data._count.favReleases
                : data._count.favSongs,
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

    fetchFavorites()
  }, [profileId, active])

  const favoriteComponents: Record<FavoriteTypes, JSX.Element> = {
    artists: <FavoriteArtists favs={favoriteArtists}/>,
    releases: <FavoriteReleases favs={favoriteReleases}/>,
    songs: <FavoriteSongs favs={favoriteSongs}/>,
  }

  return (
    <div>
      <ul
        className="list-none flex gap-2 border-b border-t border-white/5 py-2 mb-2"
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
        favoriteComponents[active]
      }
    </div>
  )
}