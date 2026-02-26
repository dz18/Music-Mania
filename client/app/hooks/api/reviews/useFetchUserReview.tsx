import { deleteReview, getUserReview, saveReview } from "@/app/lib/api/userReview";
import { ReviewKind, SaveReviewInput } from "@/app/lib/types/reviews";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function useFetchUserReview (
  itemId: string, 
  type: ReviewKind
) {

  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const { data: session, status} = useSession()

  const star = searchParams.get('star')
  const page = Number(searchParams.get('page')) || 1

  const userReviewQuery = useQuery({
    queryKey: ['userReview', itemId],
    queryFn: () => getUserReview(
      { itemId: itemId, type},
      session?.user.token
    ),
    enabled: !!itemId && status !== "loading"
  })

  const saveReviewMutation = useMutation({
    mutationFn: (input: SaveReviewInput) => saveReview(
      input,
      session?.user.token
    ),
    onSuccess: (res) => {
      queryClient.setQueryData(
        ['userReview', itemId],
        res.review
      ) 

        queryClient.invalidateQueries({
          queryKey: ['reviews', page, star]
        })
    }
  })

  const deleteReviewMutation = useMutation({
    mutationFn: async () => deleteReview(
      { itemId: itemId, type },
      session?.user.token
    ),
    onSuccess: () => {
      queryClient.setQueryData(['userReview', itemId], null)

      queryClient.invalidateQueries({
        queryKey: ['reviews', page, star]
      })
    }
  })

  return {
    userReview: userReviewQuery.data,
    saveReview: saveReviewMutation.mutateAsync,
    deleteReview: deleteReviewMutation.mutate,
    isSaving: saveReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
    isPending: userReviewQuery.isPending
  }

}