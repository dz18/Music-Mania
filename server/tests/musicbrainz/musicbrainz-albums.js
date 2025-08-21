const userAgent = 'MusicMania/0.1.1 (dylan18zuniga@gmail.com)'

async function main() {

  // const artistId = '20244d07-534f-4eff-b4d4-930878889970' // taylor
  // const artistId = '2baf3276-ed6a-4349-8d2e-f4601e7b2167' // carti
  const artistId ='6925db17-f35e-42f3-a4eb-84ee6bf5d4b0'
  const type = 'ep'
  const offset = 0

  try {
    const start = new Date()

    const releases = await fetch(`http://musicbrainz.org/ws/2/release-group?artist=${artistId}&fmt=json&type=${type}&limit=100&release-group-status=website-default&offset=${offset}`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    const releasesData = await releases.json()

    const releaseGroups = releasesData['release-groups']
    const sorted = [...releaseGroups].sort((a, b) => {
      const lenA = a['secondary-types']?.length || 0
      const lenB = b['secondary-types']?.length || 0
      return lenA - lenB
    })

    const seen = new Set()
    let i = 1
    sorted.forEach(releaseGroup => {
      const key = releaseGroup['secondary-types'].join(' + ')

      if (!seen.has(key)) {
        console.log(key || `${type}s`) 
        i = 1
        seen.add(key)
      }

      console.log(`${i}. ${releaseGroup.title}`)
      i += 1
    })
    
    const end = new Date()
    const duration = (end.getTime() - start.getTime()) / 1000
    console.log('=====================================================')
    console.log('Count:', releasesData['release-group-count'])
    console.log('Total:', releasesData['release-groups'].length)
    console.log('Time:', duration, 'seconds')
  } catch (error) {
    console.error(error)
  }
}

main()