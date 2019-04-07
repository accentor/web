import baseURL from "./base_url";

export function create(data) {
  return fetch(`${baseURL}/auth_tokens/`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(request => Promise.all([request.ok, request.json()]))
    .then(([ok, result]) => {
      if (ok) {
        return Promise.resolve(result);
      } else {
        return Promise.reject(result);
      }
    })
    .catch(reason => {
      return Promise.reject({ error: reason });
    });
}
