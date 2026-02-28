import { Release } from "./api"
import { Song } from "./song"

export type getReleaseResult = {
  release: Release,
  coverArtUrl: string
}

export type getSongResult = {
  song: Song,
  coverArtUrl: string
}