export function filterPlaysByPeriod(startDate, endDate) {
  return function (play) {
    const playedAt = new Date(play.played_at);
    return playedAt > startDate && playedAt < endDate;
  };
}

export function filterPlaysByArtist(tracks, artist_id) {
  return function (play) {
    return tracks[play.track_id]?.track_artists.some(
      (a) => a.artist_id === artist_id
    );
  };
}
