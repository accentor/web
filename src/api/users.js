import baseURL from "./base_url";

export function index(auth) {
  return fetch(`${baseURL}/users`, {
    method: "GET",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    }
  })
    .catch(reason => Promise.reject({ error: [reason] }))
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function create(auth, user) {
  return fetch(`${baseURL}/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    },
    body: JSON.stringify({ user })
  })
    .catch(reason => Promise.reject({ error: [reason] }))
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function update(auth, id, user) {
  return fetch(`${baseURL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    },
    body: JSON.stringify({ user })
  })
    .catch(reason => Promise.reject({ error: [reason] }))
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function destroy(auth, id) {
  return fetch(`${baseURL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    }
  })
    .catch(reason => Promise.reject({ error: [reason] }))
    .then(request => {
      return request.ok
        ? Promise.resolve()
        : request.json().then(result => Promise.reject(result));
    });
}
