import {
  indexGenerator,
  create as genCreate,
  read as genRead,
  update as genUpdate,
  destroy as genDestroy,
  merge as genMerge,
} from "./fetch";

export function index(auth, scope) {
  return indexGenerator("tracks", auth, scope);
}

export function create(auth, track) {
  return genCreate("tracks", auth, { track });
}

export function read(auth, id) {
  return genRead(`tracks/${id}`, auth);
}

export function update(auth, id, track) {
  return genUpdate(`tracks/${id}`, auth, { track });
}

export function destroy(auth, id) {
  return genDestroy(`tracks/${id}`, auth);
}

export function merge(auth, newID, oldID) {
  return genMerge(`tracks/${newID}/merge?other_track_id=${oldID}`, auth);
}
