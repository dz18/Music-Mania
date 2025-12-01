import ProfilePage from "./ProfilePage";

export default async function Profile ({
  params,
  searchParams
} : {
  params: Promise<{userId: string}>
  searchParams: Promise<{star: number}>
}) {

  const p = await params
  const sp = await searchParams

  const id = p.userId
  const star = Number(sp.star) ?? null

  return <ProfilePage userId={id} star={star}/>
}