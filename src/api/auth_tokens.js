import baseURL from "./base_url";
import { indexGenerator, destroy as genDestroy } from "./fetch";

export function index(auth) {
  return indexGenerator("auth_tokens", auth);
}

export function create(data) {
  return fetch(`${baseURL}/auth_tokens/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .catch((reason) => Promise.reject({ error: [reason] }))
    .then((request) => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      return ok ? Promise.resolve(result) : Promise.reject(result);
    });
}

export function destroy(auth, id) {
  return genDestroy(`auth_tokens/${id}`, auth);
}
