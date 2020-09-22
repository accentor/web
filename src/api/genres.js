import {
  indexGenerator,
  create as genCreate,
  read as genRead,
  update as genUpdate,
  destroy as genDestroy,
  destroyEmpty as genDestroyEmpty,
  merge as genMerge,
} from "./fetch";

export function index(auth) {
  return indexGenerator("genres", auth);
}

export function create(auth, genre) {
  return genCreate("genres", auth, { genre });
}

export function read(auth, id) {
  return genRead(`genres/${id}`, auth);
}

export function update(auth, id, genre) {
  return genUpdate(`genres/${id}`, auth, { genre });
}

export function destroy(auth, id) {
  return genDestroy(`genres/${id}`, auth);
}

export function destroyEmpty(auth) {
  return genDestroyEmpty("genres", auth);
}

export function merge(auth, newID, oldID) {
  return genMerge(`genres/${newID}/merge?other_genre_id=${oldID}`, auth);
}
