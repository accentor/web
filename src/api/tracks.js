import {
  indexGenerator,
  create as genCreate,
  update as genUpdate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("tracks", auth);
}

export function create(auth, track) {
  return genCreate("tracks", auth, { track });
}

export function update(auth, id, track) {
  return genUpdate(`tracks/${id}`, auth, { track });
}

export function destroy(auth, id) {
  return genDestroy(`tracks/${id}`, auth);
}
