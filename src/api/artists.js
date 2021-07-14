import {
  indexGenerator,
  create as genCreate,
  read as genRead,
  update as genUpdate,
  destroy as genDestroy,
  destroyEmpty as genDestroyEmpty,
  merge as genMerge,
} from "./fetch";

export function index(auth, scope) {
  return indexGenerator("artists", auth, scope);
}

export function create(auth, artist) {
  return genCreate("artists", auth, { artist });
}

export function read(auth, id) {
  return genRead(`artists/${id}`, auth);
}

export function update(auth, id, artist) {
  return genUpdate(`artists/${id}`, auth, { artist });
}

export function destroy(auth, id) {
  return genDestroy(`artists/${id}`, auth);
}

export function destroyEmpty(auth) {
  return genDestroyEmpty("artists", auth);
}

export function merge(auth, newID, oldID) {
  return genMerge(`artists/${newID}/merge?source_id=${oldID}`, auth);
}
