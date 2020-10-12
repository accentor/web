import baseURL from "./base_url";
const fetchRetry = require("fetch-retry")(fetch, {
  retries: 0,
  retryDelay: function (attempt) {
    return Math.pow(2, attempt) * 15000;
  },
});

export async function* indexGenerator(path, auth) {
  let page = 1;
  while (true) {
    let response;
    try {
      response = await fetchRetry(`${baseURL}/${path}?page=${page}`, {
        retries: 5,
        method: "GET",
        headers: {
          "x-secret": auth.secret,
          "x-device-id": auth.device_id,
        },
      });
    } catch (reason) {
      throw { error: [reason] };
    }
    const result = await response.json();
    if (response.ok && result) {
      const loaded = new Date();
      for (let obj in result) {
        result[obj].loaded = loaded;
      }
      if (response.headers.get("x-total-pages") == page) {
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
  let response;
  try {
    response = await fetchRetry(request);
  } catch (reason) {
    throw { error: [reason] };
  }
  const result = await response.json();
  if (response.ok) {
    return result;
  } else {
    throw result;
  }
}

export async function create(path, auth, object) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth?.secret,
      "x-device-id": auth?.device_id,
    },
    body: JSON.stringify(object),
  });
  return await resolveRequest(request);
}

export async function read(path, auth, retryOptions = {}) {
  const request = new Request(`${baseURL}/${path}`, {
    ...retryOptions,
    method: "GET",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return await resolveRequest(request);
}

export async function update(path, auth, object) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify(object),
  });
  return await resolveRequest(request);
}

export async function destroy(path, auth) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "DELETE",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return await resolveRequest(request);
}

export async function destroyEmpty(path, auth) {
  const request = new Request(`${baseURL}/${path}/destroy_empty`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return await resolveRequest(request);
}

export async function merge(path, auth) {
  const request = new Request(`${baseURL}/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  });
  return await resolveRequest(request);
}
