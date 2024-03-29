import { createApiClient } from "@accentor/api-client-js";

let url;
if (process.env.VUE_APP_API_URL !== undefined) {
  url = process.env.VUE_APP_API_URL;
} else if (process.env.NODE_ENV === "production") {
  url = "/api";
} else {
  url = "http://localhost:3000/api";
}

export const baseURL = url;

const api = createApiClient(baseURL);

export default api;
