import { create as genCreate, read as genRead } from "./fetch";

export function show(auth) {
  const retryDelay = function (attempt) {
    return Math.pow(2, attempt) * 15000;
  };
  return genRead("rescan", auth, { retries: 5, retryDelay });
}

export function start(auth) {
  return genCreate("rescan", auth);
}
