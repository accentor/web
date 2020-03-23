import baseURL from "./base_url";

export function show(auth) {
  return fetch(`${baseURL}/rescan`, {
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
