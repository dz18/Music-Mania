const { release } = require("../prisma/client")
const { scoreRelease } = require("./hooks/scoreRelease")
const prisma = require('../prisma/client')


const releaseId = '83920a38-e749-4bbf-a7f6-8aaf77cb9475'
const userAgent = process.env.USER_AGENT

const test = async (req, res) => {


    // USED IN TRACKLIST (work.id) => song page
    // const release = await fetch(`https://musicbrainz.org/ws/2/release?release-group=83920a38-e749-4bbf-a7f6-8aaf77cb9475&type=album&status=official&inc=recordings+release-groups+recording-level-rels+work-level-rels+work-rels&fmt=json&limit=100&offset=40`, {
    //   headers: {
    //     'User-Agent' : userAgent
    //   }
    // })
    // const data = await release.json()
    // res.json(data.release[0])

    // const test = data.releases.flatMap(r => {
    //   if (!r.media?.[0]?.tracks) return [];

    //   return r.media[0].tracks
    //     .filter(t => t.title.toLowerCase() === "bad idea right?")
    //     .map(t => ({
    //       releaseId: r.id,
    //       releaseDisambiguation: r.disambiguation,
    //       mediaFormat: r.media[0].format,
    //       mediaPosition: r.media[0].position,
    //       recordingId: t.recording.id,
    //       recordingDisambiguation: t.recording.disambiguation,
    //       workId: t.recording.relations[0].work.id
    //     }));
    // });
    // res.json(test)


    // HOW TO USE WORK ID to get all recordings(???)
    // const workId = '4cf676ea-6766-4a01-bd10-665eeb8dee2d'
    // const recordings = await fetch(
    //   `https://musicbrainz.org/ws/2/recording?work=4cf676ea-6766-4a01-bd10-665eeb8dee2d&fmt=json&limit=100`,
    //   { headers: { "User-Agent": userAgent } }
    // );

    // const data = await recordings.json();
    // res.json(data.recordings)

    // USING WORK id in database maybe (for singles)
    // Discography singles
    const releases = await fetch(`https://musicbrainz.org/ws/2/release?artist=6925db17-f35e-42f3-a4eb-84ee6bf5d4b0&fmt=json&limit=100&offset=0&inc=release-groups+recordings+recording-level-rels+work-rels+work-level-rels&status=official&type=single`, {
      headers: {
        'User-Agent' : userAgent
      }
    }) 
    const data = await releases.json()

    const rgInfo = await fetch(`http://musicbrainz.org/ws/2/release-group?artist=6925db17-f35e-42f3-a4eb-84ee6bf5d4b0&fmt=json&type=single&limit=100&release-group-status=website-default&offset=0`, {
      headers: {
        'User-Agent' : userAgent
      }
    }) 
    const rgData = await rgInfo.json()
    
    const singles = []
    const seen = new Set()
    for (const r of data.releases) {
      const rgid = r['release-group'].id
      if (seen.has(rgid)) continue

      singles.push(r)
      seen.add(rgid)
    }

    const discog = singles.map(s => {
      const releaseGroup = s['release-group'];
      const firstTrack = s.media?.[0]?.tracks?.[0]?.recording;
      let workId = null;

      if (firstTrack?.relations) {
        const workRel = firstTrack.relations.find(rel => rel.work?.id);
        if (workRel) workId = workRel.work.id;
      }

      return {
        ...releaseGroup,
        workId
      };
    });

    const sorted = await Promise.all(
      discog.sort((a,b) => (
        a['secondary-types']?.length - b['secondary-types']?.length
      )).map(async (rg) => {
        let data = {
          type: rg['secondary-types']?.join(' + ') || rg['primary-type'] || "Unknown",
          id: rg.id,
          workId: rg.workId,
          firstReleaseDate: rg['first-release-date'] || "",
          disambiguation: rg.disambiguation || "",
          title: rg.title,
        }
        if (!rg.workId) {
          return {
            ...data,
            averageRating: 0,
            totalReviews: 0,
          }
        }
        
        let nums = await prisma.userSongReviews.aggregate({
          where: {songId: rg.workId},
          _avg: {rating: true},
          _count: {rating: true}
        })
        const average = nums._avg.rating
        const avgRounded = average !== null && average !== undefined ? +average.toFixed(2) : 0

        return {
          ...data,
          averageRating: avgRounded ?? 0,
          totalReviews: nums._count.rating ?? 0,
        }

      })
    )

    res.json({
      data: sorted,
      count: rgData['release-group-count'],
      currentPage: 0,
      pages: Math.ceil(rgData['release-group-count'] / 100),
      limit: 100
    })


    // const fetchSingle = await fetch(`https://musicbrainz.org/ws/2/release?release-group=ee271dd5-31d2-416b-8eea-90f7087b6b75&status=official&type=single&inc=release-groups+recordings+work-level-rels+work-rels+recording-level-rels&fmt=json`, {
    //   headers: {
    //     'User-Agent': userAgent
    //   }
    // })

    // const data = await fetchSingle.json()

    const mostOfficialRelease = data.releases
      .sort((a, b) => scoreRelease(b) - scoreRelease(a))
    res.json(mostOfficialRelease)


  
}

module.exports = {
  test
}