import {
  indexGenerator,
  create as genCreate,
  update as genUpdate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("cover_filenames", auth);
}

export function create(auth, cover_filename) {
  return genCreate("cover_filenames", auth, cover_filename);
}

export function update(auth, id, cover_filename) {
  return genUpdate(`cover_filenames/${id}`, auth, cover_filename);
}

export function destroy(auth, id) {
  return genDestroy(`cover_filenames/${id}`, auth);
}
