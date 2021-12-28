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

export function calcPlayCountForAlbums(plays, tracks, useAverage = false) {
  const acc = {};
  for (const play of plays) {
    const album_id = tracks[play.track_id]?.album_id;
    if (!album_id) {
      continue;
    }

    if (!(album_id in acc)) {
      acc[album_id] = 1;
    } else {
      acc[album_id]++;
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
  const acc = {};
  for (const play of plays) {
    const album_id = tracks[play.track_id]?.album_id;
    if (!album_id) {
      continue;
    }

    if (!(album_id in acc)) {
      acc[album_id] = tracks[play.track_id]?.length || 0;
    } else {
      acc[album_id] += tracks[play.track_id]?.length || 0;
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
  const acc = {};
  for (const play of plays) {
    for (const ta of tracks[play.track_id]?.track_artists || []) {
      if (!(ta.artist_id in acc)) {
        acc[ta.artist_id] = 1;
      } else {
        acc[ta.artist_id]++;
      }
    }
  }
  return acc;
}

export function calcPlayTimeForArtists(plays, tracks) {
  const acc = {};
  for (const play of plays) {
    for (const ta of tracks[play.track_id]?.track_artists || []) {
      if (!(ta.artist_id in acc)) {
        acc[ta.artist_id] = tracks[play.track_id]?.length || 0;
      } else {
        acc[ta.artist_id] += tracks[play.track_id]?.length || 0;
      }
    }
  }
  return acc;
}
