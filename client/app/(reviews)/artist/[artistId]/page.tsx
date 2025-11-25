import ArtistPage from "@/app/components/pages/artist/ArtistPage"

export default async function Artist({
  params,
  searchParams
} : {
  params: Promise<{ artistId: string }>
  searchParams: Promise<{ star?: string }>
}) {

  const p = await params
  const sp = await searchParams

  const id = p.artistId
  const star = Number(sp.star) || null

  return <ArtistPage artistId={id} star={star}/>
}