export async function fetchAll(commit, generator, commitAction, scope = null) {
  // If there is no scope present, we prepare for removing old items
  // later (this also influences editability of items)
  if (scope === null || scope.scopes.length === 0) {
    commit("setStartLoading");
  }
  let done = false;
  let results = [];
  let counter = 0;
  while (!done) {
    let value = [];
    ({ value, done } = await generator.next());
    results.push(...value);
    if (++counter % 5 === 0) {
      commit(commitAction, results);
      results = [];
    }
  }
  commit(commitAction, results);
  // If there is no scope present, we remove old items
  if (scope === null || scope.scopes.length === 0) {
    commit("removeOld");
  }
}

export async function fetchAllPinia(
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
