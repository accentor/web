import baseURL from "./base_url";
const fetchRetry = require("fetch-retry")(fetch, {
  retries: 0,
  retryDelay: function (attempt) {
    return Math.pow(2, attempt) * 15000;
  },
});

export async function* indexGenerator(path, auth, scope = { finalQuery: "" }) {
  let page = 1;
  while (true) {
    let response, result;
    try {
      response = await fetchRetry(
        `${baseURL}/${path}?page=${page}${scope.finalQuery}`,
        {
          retries: 5,
          method: "GET",
          headers: {
            "x-secret": auth.secret,
            "x-device-id": auth.device_id,
          },
        }
      );
      result = await response.json();
    } catch (reason) {
      throw { error: [reason] };
    }
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

async function resolveRequest(path, options) {
  let response, result;
  try {
    response = await fetchRetry(`${baseURL}/${path}`, options);
    result = response.status === 204 ? true : await response.json();
  } catch (reason) {
    throw { error: [reason] };
  }
  if (response.ok) {
    return result;
  } else {
    throw result;
  }
}

export async function create(path, auth, object) {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth?.secret,
      "x-device-id": auth?.device_id,
    },
    body: JSON.stringify(object),
  };
  return await resolveRequest(path, options);
}

export async function read(path, auth, retryOptions = {}) {
  const options = {
    ...retryOptions,
    method: "GET",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  };
  return await resolveRequest(path, options);
}

export async function update(path, auth, object) {
  const options = {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
    body: JSON.stringify(object),
  };
  return await resolveRequest(path, options);
}

export async function destroy(path, auth) {
  const options = {
    method: "DELETE",
    headers: {
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  };
  return await resolveRequest(path, options);
}

export async function destroyEmpty(path, auth) {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  };
  return await resolveRequest(`${path}/destroy_empty`, options);
}

export async function merge(path, auth) {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-secret": auth.secret,
      "x-device-id": auth.device_id,
    },
  };
  return await resolveRequest(path, options);
}
