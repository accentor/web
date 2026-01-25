import type { Album, Genre, Track } from "@accentor/api-client-js";

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

export function compareTracksByArtist(t1: Track, t2: Track): number {
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
    if (!a1 && !a2) {
      return 0;
    } else if (!a1) {
      return -1;
    } else if (!a2) {
      return 1;
    }
    order = compareStrings(a1.name, a2.name);
    index++;
  }
  return order;
}

export function compareTracksByGenre(
  genres: Record<string, Genre>,
): (t1: Track, t2: Track) => number {
  return function (t1: Track, t2: Track): number {
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
      .map((g) => genres[`${g}`]?.normalized_name ?? "")
      .sort((g1, g2) => compareStrings(g1, g2));
    const t2_genres = t2.genre_ids
      .map((g) => genres[`${g}`]?.normalized_name ?? "")
      .sort((g1, g2) => compareStrings(g1, g2));

    // We loop over the sorted genres until we find a difference to sort by
    let index = 0;
    let order = 0;
    while (order === 0) {
      const g1 = t1_genres[index];
      const g2 = t2_genres[index];

      // If tracks share the same genres, but one track has one or more extra genre(s),
      // we sort the track with more genres last
      if (!g1 && !g2) {
        return 0;
      } else if (!g1) {
        return -1;
      } else if (!g2) {
        return 1;
      }
      order = compareStrings(g1, g2);
      index++;
    }
    return order;
  };
}

export function compareByRecentlyPlayed(
  stats: Record<string, { last_played_at: Date }>,
): (i1: { id: number }, i2: { id: number }) => number {
  return function (i1: { id: number }, i2: { id: number }): number {
    return (
      (stats[`${i2.id}`]?.last_played_at || new Date(0)).getTime() -
      (stats[`${i1.id}`]?.last_played_at || new Date(0)).getTime()
    );
  };
}
