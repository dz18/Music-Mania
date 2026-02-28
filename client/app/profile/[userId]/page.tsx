import ProfilePage from "./ProfilePage";

export default async function Profile ({
  params,
} : {
  params: Promise<{userId: string}>
}) {

  const p = await params

  const id = p.userId
  

  return <ProfilePage userId={id} />
}