import baseURL from "./base_url";

export function index(auth) {
  return fetch(`${baseURL}/users`, {
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

export function destroy(auth, id) {
  return fetch(`${baseURL}/users/${id}`, {
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
