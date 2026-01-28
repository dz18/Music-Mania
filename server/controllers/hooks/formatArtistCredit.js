export function formatArtistCredit (artistCredit) {
  return {
    name: artistCredit.name, 
    joinphrase: artistCredit.joinphrase, 
    artist: {
      disambiguation: artistCredit.artist.disambiguation, 
      id: artistCredit.artist.id
    }
  }
}