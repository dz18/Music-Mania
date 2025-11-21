import Amazon from "@/app/assets/Amazon"
import DailyMotion from "@/app/assets/DailyMotion"
import Google from "@/app/assets/Google"
import Instagram from "@/app/assets/Instagram"
import Napster from "@/app/assets/Napster"
import Snapchat from "@/app/assets/Snapchat"
import Spotify from "@/app/assets/Spotify"
import TikTok from "@/app/assets/TikTok"
import { Artist } from "@/app/lib/types/artist"
import { Music } from "lucide-react"
import { JSX } from "react"
import { BiShare, BiVideo } from "react-icons/bi"
import { BsWikipedia } from "react-icons/bs"
import { FaApple, FaHome, FaImage, FaImdb, FaSoundcloud, FaStream, FaTwitterSquare, FaVimeo, FaWikipediaW, FaYoutube } from "react-icons/fa"
import { FaFacebook, FaThreads, FaVk, FaWeibo } from "react-icons/fa6"
import { MdLyrics } from "react-icons/md"
import { PiTidalLogo } from "react-icons/pi"
import { SiGenius, SiMyspace, SiSongkick } from "react-icons/si"
import { TbCircleLetterA } from "react-icons/tb"

export default function ExternalResources ({
  artist
} : {
  artist: Artist | null
}) {
  
  const URLIcons: Record<string, JSX.Element> = {
    'allmusic': <TbCircleLetterA size={18} className="text-white"/>,
    'IMDb': <FaImdb size={18} className="text-amber-500"/>,
    'official homepage': <FaHome size={18} className="text-white"/>,
    'myspace': <SiMyspace size={18} className="text-blue-500"/>,
    'twitter': <FaTwitterSquare size={18} className="text-sky-500"/>,
    'instagram': <Instagram size={18}/>,
    'google': <Google size={18}/>,
    'tiktok': <TikTok size={24}/>,
    'snapchat': <Snapchat size={18}/>,
    'vk': <FaVk size={18} className="text-blue-500"/>,
    'facebook': <FaFacebook size={18} className="text-blue-500"/>,
    'threads': <FaThreads size={18} className="text-white"/>,
    'weibo': <FaWeibo size={18} className="text-pink-500"/>,
    'social network': <BiShare size={18} className="text-pink-500"/>,
    'amazon': <Amazon size={18}/>,
    'spotify': <Spotify size={18}/>,
    'napster': <Napster size={18}/>,
    'apple': <FaApple size={18} className="text-gray-300"/>,
    'tidal': <PiTidalLogo size={18} className="text-white"/>,
    'songkick': <SiSongkick size={18} className="text-pink-500"/>,
    'streaming': <FaStream size={18} className="text-white"/>,
    'soundcloud': <FaSoundcloud size={18} className="text-orange-400"/>,
    'dailymotion': <DailyMotion size={18}/>,
    'vimeo': <FaVimeo size={18} className="text-pink-500"/>,
    'video channel': <BiVideo size={18} className="text-pink-500"/>,
    'wikidata': <FaWikipediaW size={18} className="text-white"/>,
    'wikipedia': <BsWikipedia size={18} className="text-pink-500"/>,
    'youtube': <FaYoutube size={18} className="text-red-500"/>,
    'genius': <SiGenius size={18} className="text-yellow-300"/>,
    'lyrics': <MdLyrics size={18} className="text-white"/>,
    'image': <FaImage size={18} className="text-white"/>,
  }
  return (
    <>
    
      {artist?.urls &&
        <div>
          <p className="text-sm text-gray-500 font-bold mb-1">External Resources</p>
          <div className="flex gap-1 items-center">
            {artist?.urls.map((url, i) => (
              <a key={i} title={url.type} href={url.url} className="cursor-pointer w-6 h-6 flex items-center justify-center" target="_blank">
                {URLIcons[url.type]}
              </a>
            ))}
          </div>
        </div>
      }
    </>
  )
}