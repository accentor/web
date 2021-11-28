export function filterPlaysByPeriod(startDate, endDate) {
  return function (play) {
    const playedAt = new Date(play.played_at);
    console.debug(startDate, playedAt, endDate);
    return playedAt > startDate && playedAt < endDate;
  };
}
