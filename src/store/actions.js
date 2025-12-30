export async function fetchAll(
  generator,
  add,
  setStartLoading,
  removeOld,
  scope = null,
) {
  if (scope === null || scope.scopes.length === 0) {
    setStartLoading();
  }
  let done = false;
  let results = [];
  let counter = 0;
  while (!done) {
    let value = [];
    ({ value, done } = await generator.next());
    results.push(...value);
    if (++counter % 5 === 0) {
      add(results);
      results = [];
    }
  }
  add(results);
  if (scope === null || scope.scopes.length === 0) {
    removeOld();
  }
}
