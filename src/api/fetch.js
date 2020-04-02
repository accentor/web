import baseURL from "./base_url";
import paths from "./paths";

export async function* indexGenerator(collection, auth, page = 1) {
  const path = paths[collection];
  while (path) {
    const request = await fetch(`${baseURL}/${path}?page=${page}`, {
      method: "GET",
      headers: {
        "x-secret": auth.secret,
        "x-device-id": auth.device_id,
      },
    });
    const result = await request.json();
    if (request.ok && result) {
      if (
        (request.headers.has("x-total-pages") &&
          request.headers.get("x-total-pages") == page) ||
        result.length === 0
      ) {
        return result;
      } else {
        yield result;
      }
    } else {
      return Promise.reject(result);
    }
    page++;
  }
}
