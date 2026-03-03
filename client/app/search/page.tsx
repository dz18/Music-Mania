import SearchPage from "../components/pages/search/SearchPage"
import { connection } from "next/server"

export default async function Search ({
  searchParams
} : {
  searchParams: Promise<{
    tab: string, q: string
  }>
}) {

  await connection()

  const params = await searchParams

  return (
    <div>
      <SearchPage params={params}/>
    </div>
  )
}