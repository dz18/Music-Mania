import EditProfilePage from "./EditProfile";

export default async function EditProfile ({
  params
} : {
  params: Promise<{userId: string}>
}) {

  const p = await params
  const userId = p.userId

  return <EditProfilePage userId={userId}/>
}