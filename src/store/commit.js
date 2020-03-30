export function fetchAll({ commit }, { generator, commitAction }) {
  return new Promise((resolve, reject) => {
    let i = 1;
    let results = {};

    async function fetch() {
      try {
        let { value, done } = await generator.next();
        for (let obj of value) {
          results[obj.id] = obj;
        }
        if (done) {
          commit(commitAction, results);
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
