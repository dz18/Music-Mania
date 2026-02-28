import { getRelease, releaseReviewsQuery } from "@/app/lib/api/releases";
import { ReviewKind } from "@/app/lib/types/reviews";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { release } from "os";
import { useMemo, useRef } from "react";

export default function useFetchRelease (
  releaseId: string,
) {

  const searchParams = useSearchParams()

  const star = searchParams.get('star')
  const page = Number(searchParams.get('page')) || 1

  const releaseQuery = useQuery({
    queryKey: ['release', releaseId],
    queryFn: () => getRelease(releaseId),
    enabled: !!releaseId
  })

  const reviewsQuery = useQuery({
    queryKey: ["reviews", page, star],
    queryFn: () => releaseReviewsQuery({
      id: releaseId,
      star,
      page
    }),
    enabled: !!releaseId
  })

  const lastStarStats = useRef<StarCount[]>([])
  const starStats = useMemo(() => {
    let next: StarCount[] | undefined = undefined

    if (reviewsQuery.data) {
      next = reviewsQuery.data?.data.starStats
    }

    if (next) lastStarStats.current = next

    return lastStarStats.current
  }, [reviewsQuery.data])

  return {
    release: releaseQuery.data,
    releaseLoad: releaseQuery.isLoading,
    reviews: reviewsQuery.data,
    reviewsLoad: reviewsQuery.isLoading,
    error: releaseQuery.error || reviewsQuery.error,
    starStats,
    refetchReviews: reviewsQuery.refetch,
    refetchRelease: releaseQuery.refetch,
  } 

}

// export default function useFetchRelease (releaseId: string, star: number | null) {

//   const [coverArt, setCoverArt] = useState('')
//   const [release, setRelease] = useState<Release | null>(null)
//   const [releaseLoad, setReleaseLoad] = useState(false)
//   const [starStats, setStarStats] = useState<StarCount[]>([])
//   const [error, setError] = useState<string | null>(null)

//   const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)
//   const [loading, setLoading] = useState(false)

//   const fetchData = useCallback(async (page: number) => {
//     try {
//       setLoading(true)
      
//       const requests = []
//       if (!release) {
//         setReleaseLoad(true)
//         requests.push(
//           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getRelease`, {
//             params: {releaseId: releaseId}
//           })
//         )
//       }

//       requests.push(
//         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/release`,{
//           params: {id: releaseId, page: page, star: star}
//         })
//       )
      
//       const results = await Promise.all(requests)
//       let index = 0
//       if (!release) {
//         const releaseResult = results[index]
//         index++

//         setCoverArt(releaseResult.data.coverArtUrl)
//         setRelease(releaseResult.data.album)
//       }

//       const reviewResults = results[index]
//       setData(reviewResults.data)
//       setStarStats(reviewResults.data.data.starStats)
//       setError(null)
//     } catch (error : any) {
//       const err = error as AxiosError<{ error: string }>

//       console.error(error)

//       setError(
//         err.response?.data?.error ??
//         err.message ??
//         "Unknown error occurred"
//       )
//     } finally {
//       setLoading(false)
//       setReleaseLoad(false)
//     }
//   }, [releaseId, star])
    
//   useEffect(() => {
//     fetchData(1)
//   }, [fetchData])

//   return {
//     coverArt,
//     release,
//     loading,
//     fetchData,
//     error,
//     data,
//     setData,
//     releaseLoad,
//     starStats,
//     setStarStats
//   }
// }