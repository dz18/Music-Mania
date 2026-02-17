import { ApiPageResponse } from "@/app/lib/types/api";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from "../../ui/Pagination";

export default function ReleaseReviews ({
  data,
  fetchData
} : {
  data: ApiPageResponse<ProfileReleaseReview> | null,
  fetchData: (page: number) => Promise<void>
}) {

  const router = useRouter()

  return (
    <>
      {data?.count !== 0 ?
        <div className="overflow-hidden rounded-lg border border-gray-500">
          {data?.data.reviews.map((r, i) => (
            <div key={r.releaseId} 
              className={`${i % 2 == 0 ? 'bg-surface-elevated' : 'bg-surface'} 
                py-2 px-4 text-sm flex flex-col gap-1 border border-white/5`}
            >

              <div className="border-b border-white/5 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="tracking-wide font-bold font-mono hover:underline cursor-pointer pb-1 flex gap-1" onClick={() => router.push(`/release/${r.releaseId}`)}>{r.release.title}</span>
                  <span className="text-gray-500">
                    by {r.release.artistCredit?.map(a => `${a.name}${a.joinphrase}`)}
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
                {r.release.coverArt &&
                  <img src={r.release.coverArt} className="w-40"/>
                }
                <div className="flex flex-col justify-start">
                  <p className={`${r.title ? '' : 'text-gray-500'} font-semibold`}>{r.title ? r.title : 'No Title'}</p>
                  <p className={`${r.review ? '' : 'text-gray-500'}`}>{r.review ? r.review : 'No Description'}</p>     
                </div>
              </div>

            </div>
          ))}

          {data && data.count > data.limit && <Pagination data={data} fetchData={fetchData}/>}

        </div>
      :
        <div>
        </div>
      }
    </>
  )
}