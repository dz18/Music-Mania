'use client'

import Container from "@/app/components/ui/Container"
import Footer from "@/app/components/ui/Footer"
import Nav from "@/app/components/ui/NavigationBar"
import axios from "axios"
import { CalendarRange, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { use, useEffect, useState } from "react"

export default function Profile ({
  params
} : {
  params: Promise<{userId: string}>
}) {

  const { userId } = use(params)
  const {data : session} = useSession()

  const [user, setUser] = useState({
    createdAt: null,
    favArtist: [],
    favRecordings: [],
    favReleases: [],
    id : '',
    image: '',
    role: '',
    updatedAt: '',
    username: ''
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('playlists')

  useEffect(() => {
    const fetchPreview = async () => {
      if (!userId) return

      try {
        setLoading(true)
        const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/preview`, {
          params: { userId }
        })
        setUser(user.data)
      } catch (error) {
        console.error('Error fetching user preview', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [])

  return (
    <div>
      <Nav/>
      <div className="w-full min-h-screen pt-20">
        <Container>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col bg-gray-800">
              <div className="bg-gray-700 py-2 px-4 flex justify-between items-center font-mono">
                <div className="flex items-baseline gap-2">
                  <p className="text-lg flex items-center gap-1">
                    <User className="text-gray-400"/>
                    <span>{user.username}</span>
                  </p>
                </div>
                {userId === session?.user.id ?
                  <button className="cursor-pointer border-1 py-1 px-2 hover:bg-black/20 active:bg-black/40">Edit Profile</button>
                :
                  <>
                    <button className="cursor-pointer border-1 py-1 px-2 hover:bg-black/20 active:bg-black/40">Follow</button>
                  </>
                }
              </div>
              <div className="flex m-4 gap-4">
                <img 
                  className="w-50" 
                  src="/default-avatar.jpg" 
                  alt="avatar"
                />
                <div className="flex flex-col gap-3">
                  {user.createdAt &&
                    <p className="flex text-sm text-gray-500 gap-1">
                      <CalendarRange size={18}/> 
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </p>
                  }
                  <div className="flex gap-4 text-sm">
                    <p>
                      {54} <span className="font-bold">Following</span>
                    </p>
                    <p>
                      {323} <span className="font-bold">Followers</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">About Me</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos pariatur voluptatibus non sit, voluptate iste sequi molestias corrupti cupiditate quis eum eveniet deleniti cumque beatae fugit earum. A, aspernatur reprehenderit!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-gray-800">
              <div className="bg-gray-700 py-2 px-4 flex justify-between items-center font-mono">
                  <div className="flex items-baseline gap-2">
                    <p>Reviews</p>
                  </div>
              </div>
              <div className="flex">
              </div>
            </div>

            <div className="flex flex-col bg-gray-800">
              <div className="bg-gray-700 py-2 px-4 flex justify-between items-center font-mono">
                  <div className="flex items-baseline gap-2">
                    <p>Playlist</p>
                  </div>
              </div>
              <div className="flex">
              </div>
            </div>

            <div className="flex flex-col bg-gray-800">
              <div className="bg-gray-700 py-2 px-4 flex justify-between items-center font-mono">
                <div className="flex items-baseline gap-2">
                  <p className="text-lg ">Personal Favorites</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8 p-4">

                <div>
                  <p className="font-mono">Favorite Artist</p>
                  <div className="border-b-1 border-gray-500 mb-2"/>
                  <p>Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift, Kid Cudi, Taylor Swift</p>
                </div>

                <div>
                  <p className="font-mono">Favorite Recordings</p>
                  <div className="border-b-1 border-gray-500"/>
                  <p></p>
                </div>

                <div>
                  <p className="font-mono">Favorite Songs</p>
                  <div className="border-b-1 border-gray-500"/>
                </div>

              </div>
            </div>

            <div>

            </div>
            <div>

            </div>
            <div>

            </div>

          </div>
          
          
        </Container>
      </div>
      <Footer/>
    </div>
  )
}