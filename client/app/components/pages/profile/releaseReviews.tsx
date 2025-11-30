import { ApiPageResponse } from "@/app/lib/types/api";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Statistics from "../../ui/statistics";
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
      {data?.data.starStats && <Statistics stats={data?.data.starStats}/>}
      {data?.data.reviews.length !== 0 ?
        <div>
          {data?.data.reviews.map((r, i) => (
            <div key={r.releaseId} 
              className={`${i % 2 == 0 ? 'bg-gray-800' : 'bg-gray-700'} border-gray-200 py-1 p-2 text-sm flex flex-col gap-1`}
            >
              <div className="border-b flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="font-bold font-mono hover:underline cursor-pointer pb-1 flex gap-1" onClick={() => router.push(`/release/${r.releaseId}`)}>{r.release.title}</span>
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
                  <p className="font-bold font-mono">{r.title}</p>
                  <p>{r.review}</p>
                </div>
              </div>
            </div>
          ))}
          {data && <Pagination data={data} fetchData={fetchData}/>}
        </div>
      :
        <div>
          <p className="text-center font-mono text-gray-500">None</p>
        </div>
      }
    </>
  )
}