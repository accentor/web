import {
  indexGenerator,
  create as genCreate,
  update as genUpdate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("users", auth);
}

export function create(auth, user) {
  return genCreate("users", auth, { user });
}

export function update(auth, id, user) {
  return genUpdate(`users/${id}`, auth, { user });
}

export function destroy(auth, id) {
  return genDestroy(`users/${id}`, auth);
}
