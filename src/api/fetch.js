import baseURL from "./base_url";
const fetchRetry = require("fetch-retry")(fetch);

export async function* indexGenerator(path, auth) {
  let page = 1;
  while (true) {
    const request = await fetchRetry(`${baseURL}/${path}?page=${page}`, {
      retries: 5,
      retryDelay: function (attempt) {
        return Math.pow(2, attempt) * 15000;
      },
      method: "GET",
      headers: {
        "x-secret": auth.secret,
        "x-device-id": auth.device_id,
      },
    }).catch((reason) => {
      throw { error: [reason] };
    });
    const result = await request.json();
    if (request.ok && result) {
      const loaded = new Date();
      for (let obj in result) {
        result[obj].loaded = loaded;
      }
      if (request.headers.get("x-total-pages") == page) {
        return result;
      } else {
        yield result;
      }
    } else {
      throw result;
    }
    page++;
  }
}

async function resolveRequest(request) {
  const response = await fetch(request).catch((reason) => {
    throw { error: [reason] };
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  } else {
    throw result;
  }
}

export function create(path, auth, object) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify(object),
  });
  return resolveRequest(request);
}

export function read(path, auth) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "GET",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return resolveRequest(request);
}

export function update(path, auth, object) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify(object),
  });
  return resolveRequest(request);
}

export async function destroy(path, auth) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "DELETE",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return resolveRequest(request);
}

export function destroyEmpty(path, auth) {
  const request = new Request(`${baseURL}/${path}/destroy_empty`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return resolveRequest(request);
}

export function merge(path, auth) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return resolveRequest(request);
}
