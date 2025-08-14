'use client'

import Container from "@/app/components/ui/Container"
import Footer from "@/app/components/ui/Footer"
import Nav from "@/app/components/ui/NavigationBar"
import axios from "axios"
import { ChevronDown, ChevronUp } from "lucide-react"
import { use, useEffect, useState } from "react"

type Release = {
  type: string,
  id: string,
  releaseDate: string,
  disambiguation: string,
  title: string,
}

type Artist = {
  gender: string,
  name: string,
  lifeSpan: {
    begin: string,
    end: string,
    ended: boolean
  },
  type: string,
  country: string,
  disambiguation: string,
  relations: string
  genres: {
    name: string
    disambiguation: string
    id: string
  }[]
  aliases: {
    name: string
    type: string
  }[]
  membersOfband: {
    lifeSpan: {
      begin: string,
      end: string,
      ended: boolean
    },
    artist: {
      type: string,
      id: string,
      name: string,
      country: string,
      disambiguation: string
    }
  }[],
  discography : {
    singles: Release[]
    albums: Release[]
    ep: Release[]
  }
}

export default function Artist ({
  params
} : {
  params: Promise<{artistId: string}>
}) {

  const { artistId } = use(params)

  const [artist, setArtist] = useState<Artist | null>(null)
  const [aliases, setAliases] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [showDiscog, setShowDiscog] = useState({
    albums: true,
    ep: false,
    singles: false
  })

  useEffect(() => {
    
    const fetchArtist = async () => {
      try {
        const artist = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
          params : {id : artistId}
        })

        const data = artist.data
        const relations = data.relations

        for(const alias of data.aliases) setAliases(prev => [...prev, alias.name])

        console.log(relations)
        setArtist(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchArtist()
  }, [])

  return (
    <div>
      <Nav/>
      <Container>
        <div className="mt-20 min-h-screen mb-5">
          
          {/* Left */}
          <div className="flex gap-10">
            <div className="w-100">
              <img src="/default-avatar.jpg" alt="Artist" className="w-100"/>
              
              <div className="w-100 border-1 bg-gray-800 mt-4">
                <div className="bg-gray-700 border-b-1">
                  <p className="text-lg font-bold font-mono px-2 py-1">Discography</p>
                </div>
                
                <div className="flex flex-col gap-2 px-2 py-1">

                  {/* Albums */}
                  <div>
                    <div 
                      className="font-mono font-bold flex items-center cursor-pointer"
                      onClick={() => setShowDiscog(prev => ({albums: !prev.albums, singles: false, ep: false}))}
                    >
                      <ChevronDown size={18} className={`${showDiscog.albums && 'rotate-180'} mr-1 transform transition-all`}/>Albums
                    </div>
                    <div className={`${showDiscog.albums ? 'flex' : 'hidden'} flex-col gap-1`}>
                      {artist?.discography.albums.map(album => (
                        <div 
                          className="hover:underline cursor-pointer"
                          onClick={() => alert(album.id)}
                        >
                          <p className="text-baseline truncate">{album.title}</p>
                          <p className="text-sm text-gray-500">{album.releaseDate}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EP's */}
                  <div>
                    <div 
                      className="font-mono font-bold flex items-center cursor-pointer"
                      onClick={() => setShowDiscog(prev => ({albums: false, singles: false, ep: !prev.ep}))}
                    >
                      <ChevronDown size={18} className={`${showDiscog.ep && 'rotate-180'} mr-1 transform transition-all`}/>EP
                    </div>
                    <div className={`${showDiscog.ep ? 'flex' : 'hidden'} flex-col gap-1`}>
                      {artist?.discography.ep.map(ep => (
                        <div 
                          className="hover:underline cursor-pointer"
                          onClick={() => alert(ep.id)}
                        >
                          <p className="text-baseline truncate">{ep.title}</p>
                          <p className="text-sm text-gray-500">{ep.releaseDate}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Singles */}
                  <div>
                    <div 
                      className="font-mono font-bold flex items-center cursor-pointer"
                      onClick={() => setShowDiscog(prev => ({albums: false, singles: !prev.singles, ep: false}))}
                    >
                      <ChevronDown size={18} className={`${showDiscog.singles && 'rotate-180'} mr-1 transform transition-all`}/>Singles
                    </div>
                    <div className={`${showDiscog.singles ? 'flex' : 'hidden'} flex-col gap-1 transition ease-in-out`}>
                      {artist?.discography.singles.map(single => (
                        <div 
                          className="hover:underline cursor-pointer"
                          onClick={() => alert(single.id)}
                        >
                          <p className="text-baseline truncate">{single.title}</p>
                          <p className="text-sm text-gray-500">{single.releaseDate}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
            
            {/* Right */}
            <div className="flex flex-col w-full">

              {/* About */}
              <div className="flex flex-col gap-4">
                <div className="font-mono">
                  <p className="text-2xl font-bold">{artist?.name}</p>
                  <p className="text-sm">{artist?.disambiguation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold">
                    {artist?.type === 'Person' ? 'Born' : 'Formed'}
                  </p>
                  <p>{artist?.lifeSpan.begin}</p>
                </div>
                {artist?.lifeSpan.ended &&
                  <div>
                    <p className="text-sm text-gray-500 font-bold">
                      {artist?.type === 'Person' ? 'Died' : 'Disbanded'}
                    </p>
                    <p>{artist.lifeSpan.end}</p>
                  </div>
                }
                {artist?.membersOfband.length !== 0 &&
                  <div>
                    <p className="text-sm text-gray-500 font-bold">
                      {artist?.type === 'Person' ? 'Member of' : 'Members'}
                    </p>
                    {artist?.membersOfband.map((member, i) => (
                      <span
                        key={i} 
                        onClick={() => alert(member.artist.id)}
                      >
                        <span  
                          className="hover:underline cursor-pointer"
                        >
                          {member.artist.name}
                        </span>
                        {i < artist.membersOfband.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                }
                {artist?.aliases.length !== 0 &&
                  <div>
                    <p className="text-sm text-gray-500 font-bold">Aliases</p>
                    <p>{aliases.join(', ')}</p>
                  </div>
                }
                {artist?.genres &&
                  <div>
                    <p className="text-sm text-gray-500 font-bold">Genres</p>
                    {artist?.genres.map((genre, i) => (
                      <span 
                        key={genre.id}
                        onClick={() => alert(genre.id)}
                      > 
                        <span 
                          className="hover:underline cursor-pointer"
                        >
                          {genre.name}
                        </span>
                        {i < artist.genres.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                }
              </div>

              {/* Reviews */}
              <div className="mt-[2rem] font-bold font-mono text-lg">
                <p>Reviews</p>
              </div>

            </div>
              
          </div>

        </div>
      </Container>
      <Footer/>
    </div>
  )
}