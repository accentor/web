import baseURL from "./base_url";
import { indexGenerator } from "./actions";

export function index(auth) {
  return indexGenerator("cover_filenames", auth);
}

export function create(auth, cover_filename) {
  return fetch(`${baseURL}/cover_filenames`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify({ cover_filename }),
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function update(auth, id, cover_filename) {
  return fetch(`${baseURL}/cover_filenames/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify({ cover_filename }),
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function destroy(auth, id) {
  return fetch(`${baseURL}/cover_filenames/${id}`, {
    method: "DELETE",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => {
      return request.ok
        ? Promise.resolve()
        : request.json().then((result) => Promise.reject(result));
    });
}
