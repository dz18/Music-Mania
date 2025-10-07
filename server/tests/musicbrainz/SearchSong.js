
const userAgent = 'MusicMania/0.1.1 (dylan18zuniga@gmail.com)'

async function main () {
  const start = new Date()

  const q = 'ok+computer'

  try {

    const query = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=${q} AND (primarytype:album OR primarytype:ep)&inc=artist-credits&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    const res = await query.json()


    // const parsed = res.releases.map(r => ({id: r.id, artistCredit: r['artist-credit'].map(a => a.name), title: r.title, date: r.date, releaseGroup: r['release-group']}))

    // console.log(parsed.map(p => p.releaseGroup))

  } catch (error) {
    console.error(error)
  } finally {
    const end = new Date()
    const duration = (end.getTime() - start.getTime()) / 1000
    console.log('=====================================================')
    console.log('Time:', duration, 'secs')
  }
}

main()