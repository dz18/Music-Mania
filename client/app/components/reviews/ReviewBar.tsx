import { Album, ReviewResponse } from "@/app/lib/types/api";
import { Artist, Review} from "@/app/lib/types/artist";
import { NotebookText, Star } from "lucide-react";
import Favorite from "./Favorite";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import dynamic from "next/dynamic";

const ReviewModal = dynamic(() => import("./ReviewModal"), {
  ssr: false, 
  loading: () => null, // you can put a spinner here if you want
})

export default function ReviewBar ({
  item, 
  type,
  reviews,
  setReviews
} : {
  item: Artist | Album | Song | null,
  type: 'artist' | 'release' | 'song',
  reviews?: Review[]
  setReviews: Dispatch<SetStateAction<ReviewResponse | null>>
}) {

  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-between border-b-1 border-t-1 border-gray-500 py-2 my-2">
      <div className="flex flex-col">
        <p className="inline-flex font-mono text-sm">Rate:</p>
        <div className="flex gap-1 items-center mt-1">
          <Star size={18} />
          <Star size={18} />
          <Star size={18} />
          <Star size={18} />
          <Star size={18} />
        </div>
      </div>
      <div className="flex text-sm font-mono items-center gap-2">
        <button 
          className=" px-2 py-1 rounded cursor-pointer border hover:bg-teal-500/20 active:bg-teal-500/40 flex gap-1"
          onClick={() => setOpen(true)}
        >
          <NotebookText size={18}/> Review
        </button>
        {item && (
          <Favorite item={item} type={type}/>
        )}
      </div>
      {open &&
        <ReviewModal 
          item={item} 
          type={type} 
          open={open} 
          setOpen={setOpen}
          reviews={reviews}
          setReviews={setReviews}
        />
      }
    </div>
  )
}