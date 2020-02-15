import baseURL from "./base_url";

export function fetchIndex(url, page, auth) {
  return new Promise((resolve, reject) => {
    fetch(`${baseURL}/${url}?page=${page}`, {
      method: "GET",
      headers: {
        "x-secret": auth.secret,
        "x-device-id": auth.device_id
      }
    })
      .catch(reason => reject({ error: [reason] }))
      .then(request => Promise.all([request.ok, request.json()]))
      .then(([ok, result]) => {
        return ok ? resolve(result) : reject(result);
      });
  });
}
