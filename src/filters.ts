import type { Play, Track } from "@accentor/api-client-js";

export function filterPlaysByPeriod(startDate: Date, endDate: Date) {
  return function (play: Play): boolean {
    const playedAt = new Date(play.played_at);
    return playedAt > startDate && playedAt < endDate;
  };
}

export function filterPlaysByTracks(tracks: Track[]) {
  return function (play: Play): boolean {
    return tracks.some((t) => t.id === play.track_id);
  };
}
