import type { Album, Track } from "@accentor/api-client-js";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatLength(l: number): string {
  const hours = Math.floor(l / 3600);
  const minutes = Math.floor((l % 3600) / 60);
  const seconds = `${l % 60}`.padStart(2, "0");
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}
export function compareStrings(s1: string, s2: string): number {
  if (s1 > s2) {
    return 1;
  }
  if (s2 > s1) {
    return -1;
  }
  return 0;
}

function compareAlbumEditions(a1: Album, a2: Album): number {
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
  const order = compareStrings(a1.edition, a2.edition);
  return order === 0
    ? compareStrings(a1.edition_description ?? "", a2.edition_description ?? "")
    : order;
}

export function compareTracks(
  albums: Record<string, Album>,
): (t1: Track, t2: Track) => number {
  return function (t1: Track, t2: Track): number {
    const a1 = albums[t1.album_id];
    const a2 = albums[t2.album_id];
    if (a1 === undefined && a2 === undefined) {
      return t1.number - t2.number;
    } else if (a1 === undefined) {
      return 1;
    } else if (a2 === undefined) {
      return -1;
    }

    const albOrd = compareAlbumsByTitleFirst(a1, a2);
    return albOrd === 0 ? t1.number - t2.number : albOrd;
  };
}
export function compareAlbumsByTitleFirst(a1: Album, a2: Album): number {
  let order = compareStrings(a1.normalized_title, a2.normalized_title);
  order = order === 0 ? compareStrings(a1.release, a2.release) : order;
  order = order === 0 ? compareAlbumEditions(a1, a2) : order;
  return order === 0 ? a2.id - a1.id : order;
}

export function compareAlbumsByReleaseFirst(
  newestFirst = false,
): (a1: Album, a2: Album) => number {
  return function (a1: Album, a2: Album): number {
    let order = compareStrings(a1.release, a2.release);
    if (newestFirst) {
      order = order * -1;
    }
    order =
      order === 0
        ? compareStrings(a1.normalized_title, a2.normalized_title)
        : order;
    order = order === 0 ? compareAlbumEditions(a1, a2) : order;
    return order === 0 ? a2.id - a1.id : order;
  };
}
