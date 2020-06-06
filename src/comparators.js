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
  let albumOrder = compareStrings(
    rootState.albums.albums[t1.album_id] === undefined
      ? ""
      : rootState.albums.albums[t1.album_id].normalized_title,
    rootState.albums.albums[t2.album_id] === undefined
      ? ""
      : rootState.albums.albums[t2.album_id].normalized_title
  );
  albumOrder =
    albumOrder === 0
      ? compareStrings(
          rootState.albums.albums[t1.album_id] === undefined
            ? "0000-01-01"
            : rootState.albums.albums[t1.album_id].release,
          rootState.albums.albums[t2.album_id] === undefined
            ? "0000-01-01"
            : rootState.albums.albums[t2.album_id].release
        )
      : albumOrder;
  albumOrder = albumOrder === 0 ? t2.album_id - t1.album_id : albumOrder;
  return albumOrder === 0 ? t1.number - t2.number : albumOrder;
}
