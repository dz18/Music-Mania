import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ArtistReviews ({profile} : {profile: UserProfile}) {

  const router = useRouter()

  return (
    <>
      {profile.artistReviews.length !== 0 ?
        <div className="">
          {profile?.artistReviews.map((r, i) => (
            <div key={r.artistId} 
              className={`${i % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700'} py-1 p-2 text-sm flex flex-col gap-1`}
            >
              <div className="border-b flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="font-bold font-mono hover:underline cursor-pointer pb-1" onClick={() => router.push(`/artist/${r.artistId}`)}>{r.artist.name}</span>
                  <span className="text-gray-500">{new Date(r.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="font-bold flex items-center gap-1 text-gray-300">
                  {r.rating}
                  {Array.from({length: Math.floor(r.rating)}).map((_, i) =>(
                    <Star size={18} className="fill-amber-500 stroke-0 text-sm" key={i}/>
                  ))}
                </div>
              </div>
              <p className="font-bold">{r.title}</p>
              <p>{r.review}</p>
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