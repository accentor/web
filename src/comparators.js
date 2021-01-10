export function compareStrings(s1, s2) {
  if (s1 > s2) {
    return 1;
  }
  if (s2 > s1) {
    return -1;
  }
  return 0;
}

export function compareAlbumEditions(a1, a2) {
  // If one album has an edition but the other doesn't, we assume
  // that the one without an edition is the "original" and should come first.
  if (a1.edition === null && a2.edition === null) {
    return 0;
  } else if (a1.edition === null) {
    return -1;
  } else if (a2.edition === null) {
    return 1;
  }

  // If both have an edition, we sort by edition date first.
  // If that is equal, we look to the description
  let order = compareStrings(a1.edition, a2.edition);
  return order === 0
    ? compareStrings(a1.edition_description, a2.edition_description)
    : order;
}
export function compareTracks(albums) {
  return function (t1, t2) {
    const a1 = albums[t1.album_id];
    const a2 = albums[t2.album_id];
    if (a1 === undefined && a2 === undefined) {
      return t1.number - t2.number;
    } else if (a1 === undefined) {
      return 1;
    } else if (a2 === undefined) {
      return -1;
    }

    let albOrd = compareAlbumsByTitleFirst(a1, a2);
    return albOrd === 0 ? t1.number - t2.number : albOrd;
  };
}

export function compareTracksByArtist(t1, t2) {
  // tracks without artists get sorted last
  if (t1.track_artists.length === 0 && t2.track_artists.length === 0) {
    return 0;
  } else if (t1.track_artists.length === 0) {
    return 1;
  } else if (t2.track_artists.length === 0) {
    return -1;
  }

  let order = 0;
  let index = 0;
  while (order === 0) {
    const a1 = t1.track_artists[index];
    const a2 = t2.track_artists[index];

    // If tracks share the same artists, but one track has one or more extra artist(s),
    // we sort the track with more artists last
    if (typeof a1 === "undefined" && typeof a2 === "undefined") {
      return 0;
    } else if (typeof a1 === "undefined") {
      return -1;
    } else if (typeof a2 === "undefined") {
      return 1;
    }
    order = compareStrings(a1.name, a2.name);
    index++;
  }
  return order;
}

export function compareTracksByGenre(
  t1,
  t2,
  genres = store.state.genres.genres
) {
  // tracks without genres get sorted last
  if (t1.genre_ids.length === 0 && t2.genre_ids.length === 0) {
    return 0;
  } else if (t1.genre_ids.length === 0) {
    return 1;
  } else if (t2.genre_ids.length === 0) {
    return -1;
  }

  // we map the genres for each track and sort by name
  const t1_genres = t1.genre_ids
    .map((g) => genres[g].normalized_name)
    .sort((g1, g2) => compareStrings(g1, g2));
  const t2_genres = t2.genre_ids
    .map((g) => genres[g].normalized_name)
    .sort((g1, g2) => compareStrings(g1, g2));

  // We loop over the sorted genres until we find a difference to sort by
  let index = 0;
  let order = 0;
  while (order === 0) {
    const g1 = t1_genres[index];
    const g2 = t2_genres[index];

    // If tracks share the same genres, but one track has one or more extra genre(s),
    // we sort the track with more genres last
    if (typeof g1 === "undefined" && typeof g2 === "undefined") {
      return 0;
    } else if (typeof g1 === "undefined") {
      return -1;
    } else if (typeof g2 === "undefined") {
      return 1;
    }
    order = compareStrings(g1, g2);
    index++;
  }
  return order;
}

export function compareAlbumsByTitleFirst(a1, a2) {
  let order = compareStrings(a1.normalized_title, a2.normalized_title);
  order = order === 0 ? compareStrings(a1.release, a2.release) : order;
  order = order === 0 ? compareAlbumEditions(a1, a2) : order;
  return (order = order === 0 ? compareStrings(a1.id, a2.id) : order);
}

export function compareAlbumsByReleaseFirst(newestFirst = false) {
  return function (a1, a2) {
    let order = compareStrings(a1.release, a2.release);
    if (newestFirst) {
      order = order * -1;
    }
    order =
      order === 0
        ? compareStrings(a1.normalized_title, a2.normalized_title)
        : order;
    order = order === 0 ? compareAlbumEditions(a1, a2) : order;
    return (order = order === 0 ? compareStrings(a1.id, a2.id) : order);
  };
}
