import { Decimal } from "@prisma/client/runtime/library";

export const calcAvgRating = (avg: Decimal | null) =>
  avg ? +avg.toFixed(2) : 0