import baseURL from "./base_url";

export function index(auth) {
  return fetch(`${baseURL}/albums`, {
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

export function create(auth, album) {
  return fetch(`${baseURL}/albums`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    },
    body: JSON.stringify({ album })
  })
    .catch(reason => Promise.reject({ error: [reason] }))
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function update(auth, id, album) {
  return fetch(`${baseURL}/albums/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    },
    body: JSON.stringify({ album })
  })
    .catch(reason => Promise.reject({ error: [reason] }))
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function destroy(auth, id) {
  return fetch(`${baseURL}/albums/${id}`, {
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
