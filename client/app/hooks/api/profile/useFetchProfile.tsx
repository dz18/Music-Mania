import { follow, unfollow } from "@/app/lib/api/follow";
import { fetchProfile, fetchTab, fetchUserArtistReviews, fetchUserReleaseReviews, fetchUserSongReviews } from "@/app/lib/api/profile";
import { ApiPageResponse, FollowersResponse, ReviewResponse } from "@/app/lib/types/api";
import { ProfileArtistReview, ProfileReleaseReview, ProfileSongReview, TabDataMap, TabKeys } from "@/app/lib/types/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { error, profile } from "console";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useFetchProfile (
	profileId: string, 
) {

	const { data: session, status } = useSession()
  const queryClient = useQueryClient() 
	const searchParams = useSearchParams()

	const star = searchParams.get('star')

	const [page, setPage] = useState(1)
	const [selected, setSelected] = useState<TabKeys>('starStats')
	const tabs : {label: string, key: TabKeys}[] = [
    {label: 'Statistics', key: 'starStats'},
    {label: 'Artist Reviews', key: 'artistReviews' },
    {label: 'Release Reviews', key: 'releaseReviews' },
    {label: 'Song Reviews', key: 'songReviews' },
  ]

  const goToPage = (newPage: number) => setPage(newPage);

	const {
		data: profileResults,
		isLoading: profileLoading,
		error: profileError,
		isError,
		refetch: profileRefetch
	} = useQuery({
		queryKey: ["profile", profileId],
		queryFn: () => fetchProfile(
			profileId, 
			status === "authenticated" ? session?.user.token : null
		),
		enabled: !!profileId && status !== 'loading'
	})

	const artistQuery = useQuery<ApiPageResponse<ProfileArtistReview>>({
		queryKey: ["artistReviews", profileId, page, star],
		queryFn: () => fetchUserArtistReviews({profileId, page, star}),
		enabled: selected === "artistReviews" && !!profileId,
		placeholderData: (prev) => prev
	})

	const releaseQuery = useQuery<ApiPageResponse<ProfileReleaseReview>>({
		queryKey: ["releaseReviews", profileId, page, star],
		queryFn: () => fetchUserReleaseReviews({profileId, page, star}),
		enabled: selected === "releaseReviews" && !!profileId,
		placeholderData: (prev) => prev
	})

	const songQuery = useQuery<ApiPageResponse<ProfileSongReview>>({
		queryKey: ["songReviews", profileId, page, star],
		queryFn: () =>fetchUserSongReviews({profileId, page, star}),
		enabled: selected === "songReviews" && !!profileId,
		placeholderData: (prev) => prev
	})

	const followMutation = useMutation({
    mutationFn: ({
      profileId, token
    } : {
      profileId: string,
      token: string 
    }) => follow(profileId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", profileId]
      })
    }
  })

	const unfollowMutation = useMutation({
		mutationFn: ({
			profileId, token
		} : {
			profileId: string,
			token: string 
		}) => unfollow(profileId, token),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["profile", profileId]
			})
		}
	})

	const lastStarStats = useRef<StarCount[]>([])
	const starStats = useMemo(() => {
		let next: StarCount[] | undefined = undefined

		if (selected === "starStats" && profileResults?.starStats) {
			next = profileResults.starStats
		} else if (selected === "artistReviews" && artistQuery.isFetched && artistQuery.data?.data.starStats) {
			next = artistQuery.data.data.starStats
		} else if (selected === "releaseReviews" && releaseQuery.isFetched && releaseQuery.data?.data.starStats) {
			next = releaseQuery.data.data.starStats
		} else if (selected === "songReviews" && songQuery.isFetched && songQuery.data?.data.starStats) {
			next = songQuery.data.data.starStats
		}

		// Only update the ref if we have a valid value
		if (next) {
			lastStarStats.current = next
		}

		return lastStarStats.current
	}, [
		selected,
		profileResults?.starStats,
		artistQuery.data,
		artistQuery.isFetched,
		releaseQuery.data,
		releaseQuery.isFetched,
		songQuery.data,
		songQuery.isFetched
	])

	const tabLoading =
		selected === "artistReviews"
			? artistQuery.isLoading
			: selected === "releaseReviews"
			? releaseQuery.isLoading
			: selected === "songReviews"
			? songQuery.isLoading
			: false
		
	return {
		profileResults,
		profileLoading,
		profileError,
		profileRefetch,
		artistQuery,
		releaseQuery,
		songQuery,
		tabLoading,
		follow: async (profileId: string) => await followMutation.mutateAsync({profileId, token: session?.user.token}),
		followLoad: followMutation.isPending,
		unfollow: async (profileId: string) => await unfollowMutation.mutateAsync({profileId, token: session?.user.token}),
		unfollowLoad: unfollowMutation.isPending,
		star,
		selected,
		page,
		starStats,
		tabs,
		setSelected,
		goToPage
	}

  // type ReviewKeys = 'artistReviews' | 'releaseReviews' | 'songReviews' | 'starStats'
  // const tabs : {label: string, key: ReviewKeys}[] = [
  //   {label: 'Statistics', key: 'starStats'},
  //   {label: 'Artist Reviews', key: 'artistReviews' },
  //   {label: 'Release Reviews', key: 'releaseReviews' },
  //   {label: 'Song Reviews', key: 'songReviews' },
  // ]

	// const [loading, setLoading] = useState(true)
	// const [profile, setProfile] = useState<UserProfile | null>(null)
	// const [error, setError] = useState<string | null>(null)

	// const [selected, setSelected] = useState('starStats')

	// const [artistReviews, setArtistReviews] = useState<ApiPageResponse<ProfileArtistReview> | null>(null)
	// const [releaseReviews, setReleaseReviews] = useState<ApiPageResponse<ProfileReleaseReview> | null>(null)
	// const [songReviews, setSongReviews] = useState<ApiPageResponse<ProfileSongReview> | null>(null)
	// const [tabLoad, setTabLoad] = useState(false)
	// const [tabError, setTabError] = useState<string | null>(null)
	// const [followLoad, setFollowLoad] = useState(false)
	// const [starStats, setStarStats] = useState<StarCount[]>([])
	
	// const fetchProfilePage = useCallback( async () => {
	// 	if (!id) return
	// 	if (status === 'loading') return

	// 	try {
	// 		setLoading(true)
	// 		setError(null)
	// 		setTabLoad(true)

	// 		const res = await axios.get<UserProfile>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
	// 			params : { profileId: id, userId: session?.user.id}
	// 		})

	// 		setProfile(res.data)
	// 		setStarStats(res.data.starStats)
	// 		fetchTab(1)

	// 	} catch (error: any) {
	// 		setError(error.response?.data?.error || error.message)
	// 	} finally {
	// 		setLoading(false)
	// 		setTabLoad(false)
	// 	}
	// }, [id, session?.user.id, status])

	// const fetchTab = useCallback(async (page: number) => {
	// 	const apiUrl = process.env.NEXT_PUBLIC_API_URL

	// 	let url: string | null = null
	// 	let setter: ((data: any) => void) | null = null

	// 	if (selected === "artistReviews") {
	// 		url = `${apiUrl}/api/reviews/user/artists`
	// 		setter = setArtistReviews
	// 	} else if (selected === "releaseReviews") {
	// 		url = `${apiUrl}/api/reviews/user/releases`
	// 		setter = setReleaseReviews
	// 	} else if (selected === "songReviews") {
	// 		url = `${apiUrl}/api/reviews/user/songs`
	// 		setter = setSongReviews
	// 	} else {
	// 		if (profile?.starStats) {
	// 			setStarStats(profile.starStats)
	// 		}
	// 	}

	// 	if (!url || !setter) return

	// 	const params = { userId: id, page, star }

	// 	try {
	// 		setTabLoad(true)
	// 		const res = await axios.get(url, { params })
	// 		setter(res.data)
	// 		setStarStats(res.data.data.starStats)
	// 	} catch (error: any) {
	// 		setTabError(error.response?.data?.error || error.message)
	// 	} finally {
	// 		setTabLoad(false)
	// 	}
	// }, [selected, id, star])

  // const follow = useCallback(async () => {
  //   try {
	// 		if (!id) return
	// 		if (status !== 'authenticated') return
	// 		if (id === session.user.id) return

  //     setFollowLoad(true)

  //     const following = await axios.post<Following>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
  //       profileId: id
  //     }, {
	// 			headers: {
	// 				Authorization: `Bearer ${session.user.token}`
	// 			}
	// 		})

	// 		setProfile(prev => prev ? 
	// 			{
	// 				...prev, 
	// 				following: prev.following + 1,
	// 				isFollowing: true,
	// 				followingSince: following.data.createdAt
	// 			} 
	// 				: 
	// 			prev
	// 		)
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setFollowLoad(false)
  //   }
  // }, [id, status, session?.user.id])

  // const unfollow = useCallback(async () => {
  //   try {
	// 		if (!id) return
	// 		if (status !== 'authenticated') return

  //     setFollowLoad(true)
  //     await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/unfollow`, {
  //       data: { profileId: id },
	// 			headers: {
	// 				Authorization: `Bearer ${session?.user.token}`
	// 			}
  //     })

	// 		setProfile(prev => prev ?
	// 			{
	// 				...prev, 
	// 				following: prev.following - 1,
	// 				isFollowing: false,
	// 				followingSince: null
	// 			}
	// 				:
	// 			prev
	// 		)

  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setFollowLoad(false)
  //   }
  // }, [id, status, session?.user.id])

	// const currentStats = useMemo(() => (
	// 	selected === "starStats"
	// 		? profile?.starStats
	// 		: selected === "artistReviews"
	// 		? artistReviews?.data.starStats
	// 		: selected === "releaseReviews"
	// 		? releaseReviews?.data.starStats
	// 		: selected === "songReviews"
	// 		? songReviews?.data.starStats
	// 		: null
	// ), [profile, artistReviews, releaseReviews, songReviews, selected])

	// useEffect(() => {
	// 	fetchProfilePage()
	// }, [fetchProfilePage])

	// useEffect(() => {
  // 	if (!selected) return
	// 	fetchTab(1)
	// }, [selected, star])

	// return { 
	// 	profile, 
	// 	setProfile,
	// 	loading, 
	// 	error, 
	// 	fetchProfilePage, 
	// 	fetchTab,
	// 	tabLoad,
	// 	tabError,
	// 	tabs,
	// 	selected,
	// 	setSelected,
	// 	follow,
	// 	unfollow,
	// 	followLoad,
	// 	artistReviews,
	// 	releaseReviews,
	// 	songReviews,
	// 	currentStats,
	// 	starStats
	// }
}