import { ApiPageResponse } from "@/app/lib/types/api";
import Pagination from "../../ui/Pagination";
import StarRatingVisual from "../../ui/StarVisual";

export default function SongReviews ({
  data,
  fetchData
} : {
  data: ApiPageResponse<ProfileSongReview> | null,
  fetchData: (page: number) => Promise<void>
}) {

  return (
    <>
      {data?.data.reviews.length !== 0 ?
        <div className="overflow-hidden rounded-lg border border-gray-500">
          {data?.data.reviews.map((r, i) => (
            <div key={r.songId} 
              className={`${i % 2 == 0 ? 'bg-surface-elevated' : 'bg-surface'}
                py-2 px-4 text-sm flex flex-col gap-1 border border-white/5
              `}
            >
              <div className="border-b border-white/5 flex justify-between items-center">
                <div className="flex gap-2">
                  <span 
                    className="font-bold font-mono pb-1 flex gap-1 tracking-wide"  
                  >
                    {r.song.title}
                  </span>
                  <span className="text-gray-500">
                    by {r.song.artistCredit?.map(a => `${a.name}${a.joinphrase}`)}
                  </span>
                  <span className="text-gray-500">{new Date(r.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="font-bold flex items-center gap-2">
                  {r.rating}
                  <StarRatingVisual rating={Number(r.rating)}/>
                </div>
              </div>
              <div className="flex gap-4">
                {r.song.coverArt &&
                  <img src={r.song.coverArt} className="w-40"/>
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