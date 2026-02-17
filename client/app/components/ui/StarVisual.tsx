import { Star } from "lucide-react";

export default function StarRatingVisual({
  rating,
  size = 18,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex justify-center items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const base = i + 1;
        const fillPercent = rating >= base 
          ? 100 : rating === base - 0.5 ? 50 
          : 0;

        return (
          <div
            key={i}
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            {/* CLIPPED FILL */}
            <Star
              size={size}
              className="absolute inset-0 fill-amber-500 text-amber-500"
              style={{
                clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
              }}
            />

            {/* OUTLINE */}
            <Star size={size} className="relative text-amber-500" />
          </div>
        );
      })}
    </div>
  );
}
