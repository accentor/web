export function filterPlaysByPeriod(startDate, endDate) {
  return function (play) {
    const playedAt = new Date(play.played_at);
    return playedAt > startDate && playedAt < endDate;
  };
}
