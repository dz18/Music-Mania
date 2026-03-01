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
}