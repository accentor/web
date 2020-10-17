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

export function compareTracks(rootState, t1, t2) {
  const a1 = rootState.albums.albums[t1.album_id];
  const a2 = rootState.albums.albums[t2.album_id];
  if (a1 === undefined && a2 === undefined) {
    return t1.number - t2.number;
  } else if (a1 === undefined) {
    return 1;
  } else if (a2 === undefined) {
    return -1;
  }

  let albOrd = compareAlbumsByTitle(a1.normalized_title, a2.normalized_title);
  return albOrd === 0 ? t1.number - t2.number : albOrd;
}

export function compareAlbumsByTitle(a1, a2) {
  let order = compareStrings(a1.normalized_title, a2.normalized_title);
  order = order === 0 ? compareStrings(a1.release, a2.release) : order;
  order = order === 0 ? compareAlbumEditions(a1, a2) : order;
  return (order = order === 0 ? compareStrings(a1.id, a2.id) : order);
}

export function compareAlbumsByRelease(a1, a2) {
  let order = compareStrings(a1.release, a2.release);
  order =
    order === 0
      ? compareStrings(a1.normalized_title, a2.normalized_title)
      : order;
  order = order === 0 ? compareAlbumEditions(a1, a2) : order;
  return (order = order === 0 ? compareStrings(a1.id, a2.id) : order);
}
