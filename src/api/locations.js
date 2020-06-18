import {
  indexGenerator,
  create as genCreate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("locations", auth);
}

export function create(auth, location) {
  return genCreate("locations", auth, { location });
}

export function destroy(auth, id) {
  return genDestroy(`locations/${id}`, auth);
}
