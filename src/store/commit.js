import { fetchIndex } from "../api/fetch";

export function index({ commit, auth }, { url, commitAction }) {
  return new Promise((resolve, reject) => {
    let page = 1;

    function doFetch() {
      fetchIndex(url, page, auth).then(([ok, result]) => {
        if (ok && result.length === 0) {
          resolve(true);
        } else if (ok) {
          commit(commitAction, result);
          page++;
          doFetch();
        } else {
          reject(result);
        }
      });
    }

    doFetch();
  });
}
