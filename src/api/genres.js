import baseURL from "./base_url";
import { indexGenerator } from "./actions";

export function index(auth) {
  return indexGenerator("genres", auth);
}

export function create(auth, genre) {
  return fetch(`${baseURL}/genres`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify({ genre }),
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function update(auth, id, genre) {
  return fetch(`${baseURL}/genres/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify({ genre }),
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function destroy(auth, id) {
  return fetch(`${baseURL}/genres/${id}`, {
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

export function destroyEmpty(auth) {
  return fetch(`${baseURL}/genres/destroy_empty`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
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

export function merge(auth, newID, oldID) {
  return fetch(`${baseURL}/genres/${newID}/merge?other_genre_id=${oldID}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
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
