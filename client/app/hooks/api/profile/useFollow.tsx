import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useIsFollowing (profileId: string) {

  const {data: session} = useSession()

  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(null)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      if (!profileId) return

      try {
        setLoading(true)

        const countReq = axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/countFollow`,
          { params: { profileId } }
        )

        const followingReq = session?.user?.id
          ? axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
              params: { userId: session.user.id, profileId }
            })
          : Promise.resolve({ data: false })

        const [following, count] = await Promise.all([followingReq, countReq]);

        setFollowing(following.data);
        setFollowerCount(count.data.followers);
        setFollowingCount(count.data.following);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session?.user?.id, profileId]);

  const follow = async () => {
    try {
      setLoading(true)

      const following = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
        userId: session?.user.id, profileId
      })

      setFollowerCount(prev => prev + 1)
      setFollowing(following.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const unfollow = async () => {
    try {
      setLoading(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
        data: { userId: session?.user.id, profileId }
      })

      setFollowerCount(prev => prev - 1)
      setFollowing(null)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFollow = () => {
    if (following) {
      unfollow()
    } else {
      follow()
    }
  }


  return { 
    following, 
    toggleFollow, 
    follow, 
    unfollow, 
    loading,
    followerCount,
    followingCount,
    setFollowerCount,
    setFollowingCount
  }

}