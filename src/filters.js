export function filterPlaysByPeriod(startDate, endDate) {
  return function (play) {
    const playedAt = new Date(play.played_at);
    return playedAt > startDate && playedAt < endDate;
  };
}

export function filterPlaysByTracks(tracks) {
  return function (play) {
    return tracks.some((t) => t.id === play.track_id);
  };
}
