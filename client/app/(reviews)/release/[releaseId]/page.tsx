import ReleasePage from "@/app/components/pages/release/ReleasePage";

export default async function Release ({
  params,
} : {
  params: Promise<{releaseId: string}>
}) {
  
  const p = await params

  const id = p.releaseId

  return <ReleasePage releaseId={id}/>
}