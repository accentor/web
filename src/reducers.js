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

export function calcPlayTimeForTracks(plays, tracks) {
  const acc = {};
  for (const play of plays) {
    if (!(play.track_id in acc)) {
      acc[play.track_id] = tracks[play.track_id]?.length || 0;
    } else {
      acc[play.track_id] += tracks[play.track_id]?.length || 0;
    }
  }
  return acc;
}
