import baseURL from "./base_url";

export async function* indexGenerator(path, auth) {
  let page = 1;
  while (true) {
    const request = await fetch(`${baseURL}/${path}?page=${page}`, {
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
