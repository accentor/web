export function calcPlayCountForTracks(plays) {
  const acc = {};
  for (const play of plays) {
    if (!(play.track_id in acc)) {
      acc[play.track_id] = 1;
    } else {
      acc[play.track_id]++;
    }
  }
  return acc;
}
