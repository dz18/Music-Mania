import SearchPage from "./SearchPage"

export default async function Search ({
  searchParams
} : {
  searchParams: Promise<{
    type: string, q: string
  }>
}) {

  const params = await searchParams

  return (
    <div>

      <SearchPage params={params}/>

    </div>
  )
}