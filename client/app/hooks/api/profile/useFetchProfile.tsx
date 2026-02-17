import { ApiPageResponse, FollowersResponse, ReviewResponse } from "@/app/lib/types/api";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useFetchProfile (id: string, star: number | null) {

	const { data: session, status } = useSession()

  type ReviewKeys = 'artistReviews' | 'releaseReviews' | 'songReviews' | 'starStats'
  const tabs : {label: string, key: ReviewKeys}[] = [
    {label: 'Statistics', key: 'starStats'},
    {label: 'Artist Reviews', key: 'artistReviews' },
    {label: 'Release Reviews', key: 'releaseReviews' },
    {label: 'Song Reviews', key: 'songReviews' },
  ]

	const [loading, setLoading] = useState(true)
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [error, setError] = useState<string | null>(null)

	const [selected, setSelected] = useState('starStats')

	const [artistReviews, setArtistReviews] = useState<ApiPageResponse<ProfileArtistReview> | null>(null)
	const [releaseReviews, setReleaseReviews] = useState<ApiPageResponse<ProfileReleaseReview> | null>(null)
	const [songReviews, setSongReviews] = useState<ApiPageResponse<ProfileSongReview> | null>(null)
	const [tabLoad, setTabLoad] = useState(false)
	const [tabError, setTabError] = useState<string | null>(null)
	const [followLoad, setFollowLoad] = useState(false)
	const [starStats, setStarStats] = useState<StarCount[]>([])
	const fetchProfilePage = useCallback( async () => {
		if (!id) return
		if (status === 'loading') return

		try {
			setLoading(true)
			setError(null)
			setTabLoad(true)

			const res = await axios.get<UserProfile>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
				params : { profileId: id, userId: session?.user.id}
			})

			console.log('profile:',res.data)
			setProfile(res.data)
			setStarStats(res.data.starStats)
			fetchTab(1)

		} catch (error: any) {
			setError(error.response?.data?.error || error.message)
		} finally {
			setLoading(false)
			setTabLoad(false)
		}
	}, [id, session?.user.id, status])

const fetchTab = useCallback(async (page: number) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  let url: string | null = null
  let setter: ((data: any) => void) | null = null

  if (selected === "artistReviews") {
    url = `${apiUrl}/api/reviews/user/artists`
    setter = setArtistReviews
  } else if (selected === "releaseReviews") {
    url = `${apiUrl}/api/reviews/user/releases`
    setter = setReleaseReviews
  } else if (selected === "songReviews") {
    url = `${apiUrl}/api/reviews/user/songs`
    setter = setSongReviews
  } else {
		  if (profile?.starStats) {
				setStarStats(profile.starStats)
			}
	}

  if (!url || !setter) return

  const params = { userId: id, page, star }

  try {
    setTabLoad(true)
    const res = await axios.get(url, { params })
    setter(res.data)
		setStarStats(res.data.data.starStats)
  } catch (error: any) {
    setTabError(error.response?.data?.error || error.message)
  } finally {
    setTabLoad(false)
  }
}, [selected, id, star])

  const follow = useCallback(async () => {
    try {
			if (!id) return
			if (status === 'unauthenticated') return
			if (status === 'loading') return

      setFollowLoad(true)

      const following = await axios.post<Following>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
        userId: session?.user.id, profileId: id
      })

			setProfile(prev => prev ? 
				{
					...prev, 
					following: prev.following + 1,
					isFollowing: true,
					followingSince: following.data.createdAt
				} 
					: 
				prev
			)
    } catch (error) {
      console.error(error)
    } finally {
      setFollowLoad(false)
    }
  }, [id, status, session?.user.id])

  const unfollow = useCallback(async () => {
    try {
			if (!id) return
			if (status === 'unauthenticated') return
			if (status === 'loading') return

      setFollowLoad(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
        data: { userId: session?.user.id, profileId: id }
      })

			setProfile(prev => prev ?
				{
					...prev, 
					following: prev.following - 1,
					isFollowing: false,
					followingSince: null
				}
					:
				prev
			)

    } catch (error) {
      console.error(error)
    } finally {
      setFollowLoad(false)
    }
  }, [id, status, session?.user.id])

	const currentStats = useMemo(() => (
		selected === "starStats"
			? profile?.starStats
			: selected === "artistReviews"
			? artistReviews?.data.starStats
			: selected === "releaseReviews"
			? releaseReviews?.data.starStats
			: selected === "songReviews"
			? songReviews?.data.starStats
			: null
	), [profile, artistReviews, releaseReviews, songReviews, selected])

	useEffect(() => {
		fetchProfilePage()
	}, [fetchProfilePage])

	useEffect(() => {
  	if (!selected) return
		fetchTab(1)
	}, [selected, star])

	return { 
		profile, 
		setProfile,
		loading, 
		error, 
		fetchProfilePage, 
		fetchTab,
		tabLoad,
		tabError,
		tabs,
		selected,
		setSelected,
		follow,
		unfollow,
		followLoad,
		artistReviews,
		releaseReviews,
		songReviews,
		currentStats,
		starStats
	}
}