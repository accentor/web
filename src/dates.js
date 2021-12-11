export function getPaddedMonth(date) {
  return `${date.getMonth() + 1}`.padStart(2, "0");
}

export function getPaddedDate(date) {
  return `${date.getDate()}`.padStart(2, "0");
}

// Returns the date in ISO format, without converting the timezone
export function getFormattedDate(date) {
  return `${date.getFullYear()}-${getPaddedMonth(date)}-${getPaddedDate(date)}`;
}
