import baseURL from "./base_url";

export function index(auth) {
  return fetch(`${baseURL}/artists`, {
    method: "GET",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    }
  })
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      if (ok) {
        return Promise.resolve(result);
      } else {
        return Promise.reject(result);
      }
    })
    .catch(reason => Promise.reject({ error: reason }));
}

export function create(auth, artist) {
  return fetch(`${baseURL}/artists`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    },
    body: JSON.stringify({ artist })
  })
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      if (ok) {
        return Promise.resolve(result);
      } else {
        return Promise.reject(result);
      }
    })
    .catch(reason => Promise.reject({ error: reason }));
}

export function update(auth, id, artist) {
  return fetch(`${baseURL}/artists/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    },
    body: JSON.stringify({ artist })
  })
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      if (ok) {
        return Promise.resolve(result);
      } else {
        return Promise.reject(result);
      }
    })
    .catch(reason => Promise.reject({ error: reason }));
}

export function destroy(auth, id) {
  return fetch(`${baseURL}/artists/${id}`, {
    method: "DELETE",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id
    }
  })
    .then(request => {
      if (request.ok) {
        return Promise.resolve();
      } else {
        return request.json().then(result => Promise.reject(result));
      }
    })
    .catch(reason => Promise.reject({ error: reason }));
}
