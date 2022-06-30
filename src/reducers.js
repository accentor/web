export function calcPlayCountForAlbums(playStats, tracks, useAverage = false) {
  const acc = {};
  for (const stat of playStats) {
    const album_id = tracks[stat.track_id]?.album_id;
    if (!album_id) {
      continue;
    }

    if (!(album_id in acc)) {
      acc[album_id] = stat.count;
    } else {
      acc[album_id] += stat.count;
    }
  }

  if (useAverage) {
    const arr = Object.values(tracks);
    for (const album_id in acc) {
      const nrOfTracks = arr.filter((t) => t.album_id == album_id).length;
      acc[album_id] = acc[album_id] / nrOfTracks;
    }
  }
  return acc;
}

export function calcPlayTimeForAlbums(playStats, tracks, useAverage = false) {
  const acc = {};
  for (const stat of playStats) {
    const album_id = tracks[stat.track_id]?.album_id;
    if (!album_id) {
      continue;
    }

    if (!(album_id in acc)) {
      acc[album_id] = stat.total_length;
    } else {
      acc[album_id] += stat.total_length;
    }
  }

  if (useAverage) {
    const arr = Object.values(tracks);
    for (const album_id in acc) {
      const totalLength = arr
        .filter((t) => t.album_id == album_id)
        .reduce((a, b) => a + b.length, 0);
      // Since we can't divide by zero, we set albums without any trackLengths to 0
      acc[album_id] = totalLength === 0 ? 0 : acc[album_id] / totalLength;
    }
  }
  return acc;
}

export function calcPlayStatsForArtists(playStats, tracks, useTrackLength) {
  const prop = useTrackLength ? "total_length" : "count";
  const acc = {};
  for (const stat of playStats) {
    const uniqueIds = (tracks[stat.track_id]?.track_artists || [])
      .map((ta) => ta.artist_id)
      .filter((id, index, list) => list.indexOf(id) == index);
    for (const ta of uniqueIds) {
      if (!(ta in acc)) {
        acc[ta] = stat[prop];
      } else {
        acc[ta] += stat[prop];
      }
    }
  }
  return acc;
}

export function calcPlayCountForHours(plays) {
  const acc = new Array(168).fill(0);
  for (const play of plays) {
    const playedAt = new Date(play.played_at);
    const day = playedAt.getDay();
    const hour = playedAt.getHours();
    acc[day * 24 + hour]++;
  }
  // Put sunday last
  acc.push(...acc.splice(0, 24));
  return acc;
}

export function calcPlayTimeForHours(plays, tracks) {
  const binnedByTrack = {};
  for (const play of plays) {
    if (!binnedByTrack[play.track_id]) {
      binnedByTrack[play.track_id] = [play];
    } else {
      binnedByTrack[play.track_id].push(play);
    }
  }

  const acc = new Array(168).fill(0);
  for (const track_id in binnedByTrack) {
    const length = tracks[track_id]?.length || 0;
    for (const play of binnedByTrack[track_id]) {
      const playedAt = new Date(play.played_at);
      const day = playedAt.getDay();
      const hour = playedAt.getHours();
      acc[day * 24 + hour] += length;
    }
  }
  // Put sunday last
  acc.push(...acc.splice(0, 24));
  return acc;
}
