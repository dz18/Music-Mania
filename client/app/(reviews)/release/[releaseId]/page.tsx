import ReleasePage from "@/app/components/pages/release/ReleasePage";

export default async function Release ({
  params,
  searchParams
} : {
  params: Promise<{releaseId: string}>
  searchParams: Promise<{star?: string}>
}) {
  
  const p = await params
  const sp = await searchParams

  const id = p.releaseId
  const star = Number(sp.star) || null

  return <ReleasePage releaseId={id} star={star}/>
}