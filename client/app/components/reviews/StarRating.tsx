import { Star } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function StarRating ({
  hover,
  rating,
  setHover,
  setRating
} : {
  hover: number | null
  rating: number,
  setHover: Dispatch<SetStateAction<number | null>>
  setRating: Dispatch<SetStateAction<number>>
}) {

  const current = hover ?? rating;

  return (
    <div className="flex select-none">
      {Array.from({ length: 5 }).map((_, i) => {
        const base = i + 1;

        const fillPercent =
          current >= base ? 100 : current === base - 0.5 ? 50 : 0;

        return (
          <div
            key={i}
            className="relative w-6 h-6 cursor-pointer"
            onMouseLeave={() => setHover(null)}
          >
            {/* LEFT HALF */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full z-20"
              onMouseEnter={() => setHover(base - 0.5)}
              onClick={() => setRating(base - 0.5)}
            />

            {/* RIGHT HALF */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full z-20"
              onMouseEnter={() => setHover(base)}
              onClick={() => setRating(base)}
            />

            {/* CLIPPED COLOR */}
            <Star
              size={24}
              className="absolute inset-0 fill-amber-500 text-amber-500"
              style={{
                clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
              }}
            />

            {/* STAR OUTLINE */}
            <Star
              size={24}
              className="relative text-amber-500"
            />
          </div>
        );
      })}
    </div>        
  )
}