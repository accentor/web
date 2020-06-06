export async function fetchAll(commit, generator, commitAction) {
  let i = 1;
  let results = {};
  commit("setStartLoading");
  async function fetch() {
    let { value, done } = await generator.next();
    for (let obj of value) {
      results[obj.id] = obj;
    }
    if (done) {
      commit(commitAction, results);
      commit("removeOld");
      return;
    } else {
      if (i % 5 === 0) {
        commit(commitAction, results);
        results = {};
      }
      i++;
      await fetch();
    }
  }
  await fetch();
}
