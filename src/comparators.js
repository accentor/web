export function compareStrings(s1, s2) {
  if (s1 > s2) {
    return 1;
  }
  if (s2 > s1) {
    return -1;
  }
  return 0;
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

  let albOrd = compareStrings(a1.normalized_title, a2.normalized_title);
  albOrd = albOrd === 0 ? compareStrings(a1.release, a2.release) : albOrd;
  albOrd = albOrd === 0 ? compareStrings(a1.id, a2.id) : albOrd;
  return albOrd === 0 ? t1.number - t2.number : albOrd;
}
