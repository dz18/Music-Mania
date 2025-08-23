const userAgent = 'MusicMania/0.1.1 (dylan18zuniga@gmail.com)'

async function main() {
  
   const albumId = '83920a38-e749-4bbf-a7f6-8aaf77cb9475'
  // const albumId = '772ac00b-0e62-4b4b-88e5-917347f0b08e'
  // const albumId = '8821f75c-6469-4aec-a357-c48e872fd83a'
  // const albumId = '9ae7e7e9-ac40-4874-bd43-d77a9bb9b617'

  try {
    const start = new Date()
  
    const albums = await fetch(`https://musicbrainz.org/ws/2/release?release-group=${albumId}&type=album&status=official&inc=recordings+artist-credits+genres+release-groups&fmt=json&limit=100&offset=40`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    const albumsJSON = await albums.json()
    const albumData = albumsJSON.releases
    // console.log(albumData)

    const formatPriority = ["CD", "Digital Media"]
    const disambiguationPriority = ["clean", "explicit", ""]
    const sorted = [...albumData].sort((a, b) => {
      const aFormat = formatPriority.indexOf(a.media[0]?.format || "")
      const bFormat = formatPriority.indexOf(b.media[0]?.format || "")
      if (aFormat !== bFormat) return bFormat - aFormat

      const aDate = a.date ? new Date(a.date).getTime() : Infinity
      const bDate = b.date ? new Date(b.date).getTime() : Infinity
      if (aDate !== bDate) return bDate - aDate

      const aDisamb = disambiguationPriority.indexOf(a.disambiguation || "")
      const bDisamb = disambiguationPriority.indexOf(b.disambiguation || "")
      if (aDisamb !== bDisamb) return bDisamb - aDisamb

      const aLength = a.disambiguation.length
      const bLength = b.disambiguation.length
      return aLength - bLength
    })
    .map(album => {
      // console.log(album)
      const media = album.media[0]

      return {
        id: album.id,
        title: album.title,
        coverArtArchive: album['cover-art-archive'].artwork,
        disambiguation: album.disambiguation,
        date: album.date,
        tracks: media.tracks,
        format: media.format,
        trackCount: media['track-count'],
        artistCredit: album['artist-credit'],
        language: album['text-representation'].language,
        type: album['release-group']['secondary-types'].length !== 0 ? album['release-group']['secondary-types'] : album['release-group']['primary-type']
      }
    })

    console.log(sorted)
  
    // console.log('Total tracks:', sorted[0].tracks.length)
    const first = sorted[0]

    const FetchCoverArt = await fetch(`https://coverartarchive.org/release-group/${albumId}`)
    const coverArtJSON = await FetchCoverArt.json()
    const coverArt = coverArtJSON.images.filter(img => img.front === true)

    //console.log(`${first.id}:`, coverArt)

    const end = new Date()
    const duration = (end.getTime() - start.getTime()) / 1000
    console.log('=====================================================')
    console.log('Count:', albumsJSON['release-count'])
    console.log('Total:', albumData.length)
    console.log('Time:', duration, 'seconds')
    console.log('Response Object:', {
      album: first,
      coverArt: coverArt[0].image,
    })
  } catch (error) {
    console.error(error)
  }

}

main()