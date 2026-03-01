import { fetchFollowers, follow, unfollow } from "@/app/lib/api/follow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useFetchFollowers (
  profileId: string,
  following: boolean = false,
) {
  
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)

  const goToPage = (newPage: number) => setPage(newPage);

  const {
    data: results,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["followers", profileId, page, following],
    queryFn: () => fetchFollowers({
      profileId, 
      page, 
      userId: status === "authenticated" ? session?.user.id : null, 
      following
    }),
    enabled: !!profileId && status !== "loading"
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
        queryKey: ["followers", profileId]
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
        queryKey: ["followers", profileId]
      })
    }
  })
  
  return {
    results,
    loading: isLoading,
    follow: (id: string) => followMutation.mutateAsync({ profileId: id, token: session?.user.token! }),
    unfollow: (id: string) => unfollowMutation.mutateAsync({profileId: id, token: session?.user.token!}),
    refetch,
    page,
    goToPage
  }

}