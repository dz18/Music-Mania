import SongPage from "@/app/components/pages/song/SongPage";

export default async function Song ({
  params,
} : {
  params: Promise<{songId: string}>
}) {

  const p = await params
  const id = p.songId

  return <SongPage songId={id} />
}