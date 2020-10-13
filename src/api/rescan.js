import { create as genCreate, read as genRead } from "./fetch";

export function show(auth) {
  return genRead("rescan", auth, { retries: 5 });
}

export function start(auth) {
  return genCreate("rescan", auth);
}
