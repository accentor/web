import { fetchIndex } from "../api/fetch";

export function index({ commit, auth }, { url, commitAction }) {
  return new Promise((resolve, reject) => {
    let page = 1;
    let results = {};

    function doFetch() {
      fetchIndex(url, page, auth)
        .then(([request, result]) => {
          for (let obj of result) {
            results[obj.id] = obj;
          }
          if (
            (request.headers.has("x-total-pages") &&
              request.headers.get("x-total-pages") == page) ||
            result.length === 0
          ) {
            commit(commitAction, results);
            resolve(true);
          } else {
            if (page % 5 === 0) {
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
