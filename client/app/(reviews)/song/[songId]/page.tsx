import SongPage from "@/app/components/pages/song/SongPage";

export default async function Song ({
  params,
  searchParams
} : {
  params: Promise<{songId: string}>
  searchParams: Promise<{star?: string}>
}) {

  const p = await params
  const sp = await searchParams

  const id = p.songId
  const star = Number(sp.star) || null

  return <SongPage songId={id} star={star}/>
}