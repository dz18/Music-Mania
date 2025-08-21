const userAgent = 'MusicMania/0.1.1 (dylan18zuniga@gmail.com)'

async function main() {

  // const id = '20244d07-534f-4eff-b4d4-930878889970' // Taylor Swift
  // const id = '164f0d73-1234-4e2c-8743-d77bf2191051' // Kanye
  const id = '6925db17-f35e-42f3-a4eb-84ee6bf5d4b0'

  const validURLTypes = [
    'allmusic',
    'IMDb',
    'myspace',
    'official homepage',
    'social network',
    'songkick',
    'soundcloud',
    'streaming',
    'video channel',
    'wikidata',
    'wikipedia',
    'youtube',
    'youtube music',
    'lyrics',
    'image'
  ]

  try {
    const start = new Date()

    const fetchArtist = await fetch(`https://musicbrainz.org/ws/2/artist/${id}?inc=aliases+genres+artist-rels+url-rels&fmt=json`, {
      headers: {
        'User-Agent' : userAgent
      }
    })

    const artist = await fetchArtist.json()
    console.log(artist)

    const relations = artist['relations']
    // console.log(relations)

    const URLRelations = []
    for (const relation of relations) {
      if (validURLTypes.includes(relation.type) && relation.url) {
        if (relation.type === 'social network') {
          if (relation.url.resource.includes('instagram') ) {
            URLRelations.push({
              type: 'instagram',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('twitter')) {
            URLRelations.push({
              type: 'twitter',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('myspace')) {
            URLRelations.push({
              type: 'myspace',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('google')) {
            URLRelations.push({
              type: 'google',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('tiktok')) {
            URLRelations.push({
              type: 'tiktok',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('snapchat')) {
            URLRelations.push({
              type: 'snapchat',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('vk')) {
            URLRelations.push({
              type: 'vk',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('facebook')) {
            URLRelations.push({
              type: 'facebook',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('threads')) {
            URLRelations.push({
              type: 'threads',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('weibo')) {
            URLRelations.push({
              type: 'threads',
              url: relation.url.resource
            })
          } else {
            URLRelations.push({
              type: 'social network',
              url: relation.url.resource
            })
          }
        } else if (relation.type === 'streaming') {
          if (relation.url.resource.includes('amazon')) {
            URLRelations.push({
              type: 'amazon',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('spotify')) {
            URLRelations.push({
              type: 'spotify',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('napster')) {
            URLRelations.push({
              type: 'napster',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('apple')) {
            URLRelations.push({
              type: 'apple',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('tidal')) {
            URLRelations.push({
              type: 'tidal',
              url: relation.url.resource
            })
          } else {
            URLRelations.push({
              type: 'streaming',
              url: relation.url.resource
            })
          }
        } else if (relation.type === 'lyrics') {
          if (relation.url.resource.includes('genius')) {
            URLRelations.push({
              type: 'genius',
              url: relation.url.resource
            })
          } else {
            URLRelations.push({
              type: 'lyrics',
              url: relation.url.resource
            })
          }
        } else if (relation.type === 'video channel'){
          if (relation.url.resource.includes('dailymotion')) {
            URLRelations.push({
              type: 'dailymotion',
              url: relation.url.resource
            })
          } else if (relation.url.resource.includes('vimeo')){
            URLRelations.push({
              type: 'vimeo',
              url: relation.url.resou
            })
          } else {
            URLRelations.push({
              type: 'video channel',
              url: relation.url.resource
            })
          }
        } else {
          URLRelations.push({
            type: relation.type,
            url: relation.url.resource
          })
        }
      }
    }
    //console.log(URLRelations)
    console.log("URL Relations:",URLRelations.length)


    console.log("Total relations:", relations.length)
    const end = new Date()
    const duration = (end.getTime() - start.getTime()) / 1000
    console.log('=====================================================')
    console.log('Time:', duration, 'seconds')
  } catch (error) {
    console.error(error)
  }

}

main()