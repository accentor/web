import { indexGenerator } from "../api/fetch";

export function fetchAll({ commit, rootState }, { collection, commitAction }) {
  return new Promise((resolve, reject) => {
    let i = 1;
    let results = {};
    const generator = indexGenerator(collection, rootState.auth);
    commit("setStartLoading");
    async function fetch() {
      try {
        let { value, done } = await generator.next();
        for (let obj of value) {
          results[obj.id] = obj;
        }
        if (done) {
          commit(commitAction, results);
          commit("removeOld");
          resolve(true);
        } else {
          if (i % 5 === 0) {
            commit(commitAction, results);
            results = {};
          }
          i++;
          fetch();
        }
      } catch (error) {
        reject(error);
      }
    }
    fetch();
  });
}
