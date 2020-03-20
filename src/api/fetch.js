import baseURL from "./base_url";

export function fetchIndex(url, page, auth) {
  return new Promise((resolve, reject) => {
    fetch(`${baseURL}/${url}?page=${page}&sort_direction=desc`, {
      method: "GET",
      headers: {
        "x-secret": auth.secret,
        "x-device-id": auth.device_id
      }
    })
      .catch(reason => reject({ error: [reason] }))
      .then(request => Promise.all([request, request.json()]))
      .then(([request, result]) => {
        return request.ok ? resolve([request, result]) : reject(result);
      });
  });
}
