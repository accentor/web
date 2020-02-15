import { fetchIndex } from "../api/fetch";

export function index({ commit, auth }, { url, commitAction }) {
  return new Promise((resolve, reject) => {
    let page = 1;
    let results = {};

    function doFetch() {
      fetchIndex(url, page, auth)
        .then(result => {
          if (result.length === 0) {
            commit(commitAction, results);
            resolve(true);
          } else {
            for (let obj of result) {
              results[obj.id] = obj;
            }
            if (page % 10 === 0) {
              commit(commitAction, results);
              results = {};
            }
            page++;
            doFetch();
          }
        })
        .catch(result => reject(result));
    }

    doFetch();
  });
}
