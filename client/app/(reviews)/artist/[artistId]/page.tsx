import ArtistPage from "@/app/components/pages/artist/ArtistPage"

export default async function Artist({
  params,
} : {
  params: Promise<{ artistId: string }>
}) {

  const p = await params

  const id = p.artistId

  return <ArtistPage artistId={id}/>
}