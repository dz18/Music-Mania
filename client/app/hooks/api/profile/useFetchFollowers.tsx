import { fetchFollowers, follow, unfollow } from "@/app/lib/api/follow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

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

// export default function usefetchFollowers (
//   profileId: string, 
//   following: boolean = false
// ) {

//   const [results, setResults] = useState<ApiPageResponse<FollowersResponse> | null>(null)
//   const [loading, setLoading] = useState(false)
//   const {data: session, status} = useSession()

//   const fetchFollows = useCallback(async (page: number) => {
//     try {
//       setLoading(true)
//       const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/allFollowers`, {
//         params: { profileId : profileId, page: page, userId: session?.user.id, following: following }
//       })

//       setResults(results.data)
//     } catch (error) {
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }, [profileId, session?.user.id])

//   useEffect(() => {
//     fetchFollows(1)
//   }, [fetchFollows])

//   const follow = async (id: string) => {
//     if (status !== 'authenticated') return
//     if (id === session.user.id) return
    
//     try {

//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
//         profileId: id
//       }, {
// 				headers: {
// 					Authorization: `Bearer ${session.user.token}`
// 				}
// 			})

//       setResults(prev => 
//         prev ? ({
//           ...prev, data: {
//             ...prev?.data, 
//             is {...prev?.data.isFollowingMap, [id]: true}
//           }
//         }) : prev
//       ) 

//     } catch (error) {
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const unfollow = async (id: string) => {
//     if (status !== 'authenticated') return

//     try {
      
//       await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/unfollow`, {
//         data: { profileId: id },
//         headers: {
//           Authorization: `Bearer ${session?.user.token}`
//         }
//       })

//       setResults(prev => 
//         prev ? ({
//           ...prev, data: {
//             ...prev?.data, 
//             isFollowingMap: {...prev?.data.isFollowingMap, [id]: false}
//           }
//         }) : prev
//       ) 

//     } catch (error) {
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return { results, follow, unfollow, loading, fetchFollows }

// }