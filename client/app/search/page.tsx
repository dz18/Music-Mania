import SearchPage from "../components/pages/search/SearchPage"

export default async function Search ({
  searchParams
} : {
  searchParams: Promise<{
    tab: string, q: string
  }>
}) {

  const params = await searchParams

  return (
    <div>
      <SearchPage params={params}/>
    </div>
  )
}