import { useRouter } from "next/navigation";

export default function DisplayFavorites({profile} : {profile : UserProfile}){

  const router = useRouter()

  return (
    <table className="w-full table-fixed border-t border-gray-500">
      <thead>
        <tr>
          <th className="border-b border-gray-500 px-4 py-2 text-center font-mono">
            Artist <span className="text-teal-500">{profile.favArtists.length}</span>
          </th>
          <th className="border-b border-r border-l border-gray-500 px-4 py-2 text-center font-mono">
            Release <span className="text-teal-500">{profile.favReleases.length}</span>
          </th>
          <th className="border-b px-4 py-2 text-center font-mono border-gray-500">
            Song <span className="text-teal-500">{profile.favSongs.length}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {Array.from({
          length: Math.max(
            profile.favArtists.length,
            profile.favReleases.length,
            profile.favSongs.length
          ),
        }).map((_, i) => {
          const artist = profile.favArtists[i];
          const release = profile.favReleases[i];
          const song = profile.favSongs[i];

          return (
            <tr key={i}>

              {/* ARTIST */}
              <td className="px-2">
                {artist ?
                  <div className="flex items-center text-sm flex-col">
                    <p 
                      className="font-bold hover:underline cursor-pointer"
                      onClick={() => router.push(`/artist/${artist.artistId}`)}
                    >
                      {artist.artist.name}
                    </p>
                    <p className="text-gray-500">
                      since {new Date(release?.since).toLocaleDateString()}
                    </p>
                  </div>
                : (
                 "" 
                )}
              </td>

              {/* RELEASE */}
              <td className="border-l border-r border-gray-500 px-4 py-2">
                {release ? (
                  <div className="flex items-center gap-2">
                    {release.release.coverArt && (
                      <img
                        src={release.release.coverArt}
                        className="w-12 h-12 object-contain"
                      />
                    )}

                    <div className="flex flex-col text-sm min-w-0">
                      <p 
                        className="font-bold truncate hover:underline cursor-pointer"
                        onClick={() => router.push(`/release/${release.releaseId}`)}
                      >
                        {release.release.title}
                      </p>
                      <p className="truncate text-gray-500">
                        {release.release.artistCredit.map(ac => 
                          `${ac.name}${ac.joinphrase}`
                        )}
                      </p>
                    </div>

                  </div>
                ) : (
                  ""
                )}
              </td>

              {/* SONG */}
              <td className="px-4 py-2">
                {song ? (
                  <div className="flex items-center gap-2 min-w-0">
                    {song.song.coverArt &&
                      <img src={song.song.coverArt} className="w-12 h-12 object-contain"/>
                    }
                    <div className="flex flex-col text-sm min-w-0">
                      <p 
                        className="font-bold truncate hover:underline cursor-pointer"
                        onClick={() => router.push(`/song/${song.songId}`)}
                      >
                        {song.song.title}
                      </p>
                      <p className="truncate text-gray-500">{song.song.artistCredit.map(ac => `${ac.name}${ac.joinphrase}`)}</p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>



  )
}