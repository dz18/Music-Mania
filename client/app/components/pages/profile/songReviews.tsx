import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SongReviews ({profile} : {profile: UserProfile}) {

  const router = useRouter()

  return (
    <>
      {profile?.songReviews.length !== 0 ?
        <div>
          {profile?.songReviews.map((r, i) => (
            <div key={r.songId} 
                className={`${i % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700'}  py-1 p-2 text-sm flex flex-col gap-1`}
              >
                <div className="border-b flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="font-bold font-mono hover:underline cursor-pointer pb-1 flex gap-1"  onClick={() => router.push(`/song/${r.songId}`)}>{r.song.title}</span>
                    <span className="text-gray-500">
                      by {r.song.artistCredit?.map(a => `${a.name}${a.joinphrase}`)}
                    </span>
                    <span className="text-gray-500">{new Date(r.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="font-bold flex items-center gap-1 text-gray-300">
                    {r.rating}
                    {Array.from({length: Math.floor(r.rating)}).map((_, i) =>(
                      <Star size={18} className="fill-amber-500 stroke-0 text-sm" key={i}/>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  {r.song.coverArt &&
                    <img src={r.song.coverArt} className="w-40"/>
                  }
                  <div className="flex flex-col justify-start">
                    <p className="font-bold font-mono">{r.title}</p>
                    <p>{r.review}</p>
                  </div>
                </div>
              </div>
          ))}
        </div>
      :
        <div>
          <p className="text-center font-mono text-gray-500">None</p>
        </div>
      }
    </>
  )
}