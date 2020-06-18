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
