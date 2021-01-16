export async function fetchAll(commit, generator, commitAction, scope = null) {
  commit("setStartLoading");
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
  // If a scope is present, we skip removeOld
  if (scope === null) {
    commit("removeOld");
  }
}
