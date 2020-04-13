import baseURL from "./base_url";

export async function* indexGenerator(path, auth, page = 1) {
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
