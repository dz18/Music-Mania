import axios from "axios";
import { profile } from "console";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function fetchFollowers (profileId: string, following: boolean = false) {

  const [results, setResults] = useState<FollowersResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const {data: session} = useSession()

  useEffect(() => {
 
    fetchFollowers()

  }, [profileId, session?.user.id, page])

  const fetchFollowers = async () => {
    try {
      setLoading(true)
      const results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/allFollowers`, {
        params: { profileId : profileId, page: page, userId: session?.user.id, following: following }
      })
      console.log(results.data)
      setResults(results.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const follow = async (id: string) => {
    try {
      setLoading(true)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
        userId: session?.user.id, profileId: id
      })

      setResults(prev =>
        prev ? {...prev, isFollowing: {...prev.isFollowing, [id]: true}} : prev
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const unfollow = async (id: string) => {
    try {
      setLoading(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
        data: { userId: session?.user.id, profileId: id }
      })

      setResults(prev =>
        prev ? {...prev, isFollowing: {...prev.isFollowing, [id]: false}} : prev
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return { results, follow, unfollow, loading, setPage }

}