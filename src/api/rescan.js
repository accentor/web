import baseURL from "./base_url";
const fetchRetry = require("fetch-retry")(fetch);

export function show(auth) {
  return fetchRetry(`${baseURL}/rescan`, {
    retries: 5,
    retryDelay: function (attempt) {
      return Math.pow(2, attempt) * 15000;
    },
    method: "GET",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function start(auth) {
  return fetch(`${baseURL}/rescan`, {
    method: "POST",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}
