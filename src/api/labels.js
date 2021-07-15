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
  return indexGenerator("labels", auth);
}

export function create(auth, label) {
  return genCreate("labels", auth, { label });
}

export function read(auth, id) {
  return genRead(`labels/${id}`, auth);
}

export function update(auth, id, label) {
  return genUpdate(`labels/${id}`, auth, { label });
}

export function destroy(auth, id) {
  return genDestroy(`labels/${id}`, auth);
}

export function destroyEmpty(auth) {
  return genDestroyEmpty("labels", auth);
}

export function merge(auth, newID, oldID) {
  return genMerge(`labels/${newID}/merge?source_id=${oldID}`, auth);
}
