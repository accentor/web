import { fetchIndex } from "../api/fetch";

export function index({ commit, auth }, { url, commitAction }) {
  return new Promise((resolve, reject) => {
    let page = 1;

    function doFetch() {
      fetchIndex(url, page, auth)
        .then(result => {
          if (result.length === 0) {
            resolve(true);
          } else {
            commit(commitAction, result);
            page++;
            doFetch();
          }
        })
        .catch(result => reject(result));
    }

    doFetch();
  });
}
