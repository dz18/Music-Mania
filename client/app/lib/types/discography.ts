import { ReleaseGroup } from "./api";

export type DiscographyResponse = {
  data: ReleaseGroup[],
  count: number, // Total number of items
  currentPage: number, // What page you are currently on
  pages: number, // Total number of pages
  limit: number // How many items show per page
}

export type DiscographyType = "album" | "single" | "ep"