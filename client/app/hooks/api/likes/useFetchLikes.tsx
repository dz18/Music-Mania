import { checkUserLike, deleteLikedItem, likeItem } from "@/app/lib/api/likes";
import { ArtistCredit } from "@/app/lib/types/api";
import { ReviewKind } from "@/app/lib/types/reviews";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useFetchLikes (
  itemId: string,
  type: ReviewKind
) {

  const queryClient = useQueryClient()
  const { data: session, status } = useSession()

  const checkLikeQuery = useQuery({
    queryKey: ['like', itemId, type],
    queryFn: () => checkUserLike(
      { itemId, type },
      session?.user.token
    ),
    enabled: !!itemId && !!type && status !== 'loading'
  })

  const likeItemMutate = useMutation({
    mutationFn: (body: {
      itemId: string,
      type: ReviewKind,
      name: string | null,
      title: string | null,
      artistCredit: ArtistCredit[] | null,
      coverArt: string | null
    }) => likeItem(
      body,
      session?.user.token
    ),
    onSuccess: (res) => {
      queryClient.setQueryData(
        ['like', itemId, type],
        res
      )
    }
  })

  const deleteLikedItemMutate = useMutation({
    mutationFn: (data: {
      itemId: string,
      type: ReviewKind
    }) => deleteLikedItem(
      data,
      session?.user.token
    ),
    onSuccess: () => {
      queryClient.setQueryData(
        ['like', itemId, type], 
        null
      )
    }
  })

  return {
    isLiked: !!checkLikeQuery.data,
    LikeData: checkLikeQuery.data,
    loadingLike: checkLikeQuery.isLoading,
    like: likeItemMutate.mutateAsync,
    isLiking: likeItemMutate.isPending,
    unlike: deleteLikedItemMutate.mutateAsync,
    isUnliking: deleteLikedItemMutate.isPending
  }

}