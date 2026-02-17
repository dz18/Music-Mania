import { ApiPageResponse } from "@/app/lib/types/api";
import { useRouter } from "next/navigation";
import Pagination from "../../ui/Pagination";
import StarRatingVisual from "../../ui/StarVisual";

export default function ArtistReviews ({
  data,
  fetchData
} : {
  data: ApiPageResponse<ProfileArtistReview> | null,
  fetchData: (page: number) => Promise<void>
}) {

  const router = useRouter()

  return (
    <div
      className="flex flex-col gap-2"
    >

      {data?.data.reviews.length !== 0 ?
        <div className="overflow-hidden rounded-lg border border-gray-500">
          {data?.data.reviews.map((r, i) => (
            <div key={r.artistId} 
              className={`
                ${i % 2 == 0 ? 'bg-surface-elevated' : 'bg-surface'} 
                py-2 px-4 text-sm flex flex-col gap-1 border border-white/5
              `}
            >
              <div className="border-b border-white/5 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="font-bold font-mono hover:underline cursor-pointer pb-1" onClick={() => router.push(`/artist/${r.artistId}`)}>{r.artist.name}</span>
                </div>
                <div className="font-semibold flex items-center gap-2">
                  {r.rating}
                  <StarRatingVisual rating={Number(r.rating)}/>
                </div>
              </div>
              <p className={`${r.title ? '' : 'text-gray-500'} font-semibold`}>{r.title ? r.title : 'No Title'}</p>
              <p className={`${r.review ? '' : 'text-gray-500'}`}>{r.review ? r.review : 'No Description'}</p>                  
              <p className="text-gray-500">{new Date(r.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {data && data.count > data.limit && <Pagination data={data} fetchData={fetchData}/>}
        </div>
      :
        <div>
          <p className="text-center font-mono text-gray-500">None</p>
        </div>
      }
    </div>
  )
}