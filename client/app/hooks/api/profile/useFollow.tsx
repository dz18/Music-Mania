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

    const isFollowing = async () => {
      if (!profileId || !session?.user?.id) return

      try {
        setLoading(true)
        const [following, countFollow] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
            params: { userId : session.user.id, profileId: profileId}
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/countFollow`, {
            params: { profileId: profileId }
          })
        ])
        
        setFollowing(following.data)
        setFollowerCount(countFollow.data.followers)
        setFollowingCount(countFollow.data.following)

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    isFollowing()

  }, [session?.user?.id, profileId])

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