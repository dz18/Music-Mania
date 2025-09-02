const userAgent = 'MusicMania/0.1.1 (dylan18zuniga@gmail.com)'

async function main() {

  const songId = '02251981-33fa-4249-9724-2a87293586c4'

  try {
    const start = new Date()

    const fetchSong = await fetch(`https://musicbrainz.org/ws/2/recording/${songId}?fmt=json&inc=artist-rels+artist-credits+genres`, {
      headers: {
        'User-Agent': userAgent
      }
    })

    const song = await fetchSong.json()
    console.log(song)

    // const relations = song.relations.filter(r => 
    //   r.direction === 'backward'
    // ).map(r => (
    //   {
    //     attributes: r.attributes,
    //     artist: r.artist,
    //     type: r.type
    //   }
    // ))
    //console.log(relations)

    const end = new Date()
    const duration = (end.getTime() - start.getTime()) / 1000
    console.log('=====================================================')
    console.log('Time:', duration, 'secs')
  } catch (error) {
    console.error(error)
  }

}

main()