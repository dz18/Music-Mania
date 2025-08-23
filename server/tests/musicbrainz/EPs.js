
const userAgent = 'MusicMania/0.1.1 (dylan18zuniga@gmail.com)'

async function main() {

  const id = '20244d07-534f-4eff-b4d4-930878889970'

  try {
    const start = new Date()
    const releases = await fetch(`https://musicbrainz.org/ws/2/release-group/?artist=${id}&fmt=json&type=single&limit=100`, {
      headers: {
        'User-Agent' : userAgent
      }
    }) 

    console.log('running')
    const releasesData = await releases.json()
    console.log(releasesData)

    const offsetPromises = []
    if (releasesData['release-group-count'] > 100) {
      let offset = 100
      while (offset < releasesData['release-group-count']) {
        console.log(offset)
        offsetPromises.push(
          fetch(
            `https://musicbrainz.org/ws/2/release/?artist=${id}&fmt=json&type=album&status=official&limit=100&offset=${offset}`,
            { headers: { "User-Agent": userAgent, Accept: "application/json" } }
          )
        )
        offset += 100
      }

      const responses = await Promise.all(offsetPromises)
      const releasesPages = await Promise.all(responses.map(r => r.json()))
      const allReleases = releasesPages.flatMap(p => p.releases)
      console.log("Total releases:", allReleases.length)
    }

    let seen = new Set()
    let EPs = []
    for (const releaseGroup of releasesData['release-groups']) {
      if (!seen.has(releaseGroup.id) && releaseGroup['secondary-types'].length === 0) { 
        EPs.push(releaseGroup)
        seen.add(releaseGroup.id)
      }
    }
    console.log(EPs)
    console.log("Total EPs",EPs.length)

    const end = new Date()
    const duration = (end.getTime() - start.getTime()) / 1000
    console.log('=====================================================')
    console.log('Count:', releasesData['release-group-count'])
    console.log('Total:', releasesData['release-groups'].length)
    console.log('Time:', duration, 'seconds')
  } catch (error) {

  }

}

main()