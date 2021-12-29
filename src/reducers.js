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
  const acc = calcPlayCountForTracks(plays);
  for (const track_id in acc) {
    acc[track_id] = acc[track_id] * tracks[track_id]?.length || 0;
  }
  return acc;
}

export function calcPlayCountForAlbums(plays, tracks, useAverage = false) {
  const playCounts = calcPlayCountForTracks(plays);
  const acc = {};
  for (const track_id in playCounts) {
    const album_id = tracks[track_id]?.album_id;
    if (!album_id) {
      continue;
    }

    if (!(album_id in acc)) {
      acc[album_id] = playCounts[track_id];
    } else {
      acc[album_id] += playCounts[track_id];
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

export function calcPlayTimeForAlbums(plays, tracks, useAverage = false) {
  const playCounts = calcPlayCountForTracks(plays);
  const acc = {};
  for (const track_id in playCounts) {
    const track = tracks[track_id];
    if (!track) {
      continue;
    }

    if (!(track.album_id in acc)) {
      acc[track.album_id] = playCounts[track_id] * track.length;
    } else {
      acc[track.album_id] += playCounts[track_id] * track.length;
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

export function calcPlayCountForArtists(plays, tracks) {
  const playCounts = calcPlayCountForTracks(plays);
  const acc = {};
  for (const track_id in playCounts) {
    const uniqueIds = (tracks[track_id]?.track_artists || [])
      .map((ta) => ta.artist_id)
      .filter((id, index, list) => list.indexOf(id) == index);
    for (const ta of uniqueIds) {
      if (!(ta in acc)) {
        acc[ta] = playCounts[track_id];
      } else {
        acc[ta] += playCounts[track_id];
      }
    }
  }
  return acc;
}

export function calcPlayTimeForArtists(plays, tracks) {
  const playCounts = calcPlayCountForTracks(plays);
  const acc = {};
  for (const track_id in playCounts) {
    const uniqueIds = (tracks[track_id]?.track_artists || [])
      .map((ta) => ta.artist_id)
      .filter((id, index, list) => list.indexOf(id) == index);
    for (const ta of uniqueIds) {
      if (!(ta in acc)) {
        acc[ta] = playCounts[track_id] * tracks[track_id].length;
      } else {
        acc[ta] += playCounts[track_id] * tracks[track_id].length;
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
