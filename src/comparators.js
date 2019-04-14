export function compareStrings(s1, s2) {
  if (s1 > s2) {
    return 1;
  }
  if (s2 > s1) {
    return -1;
  }
  return 0;
}
