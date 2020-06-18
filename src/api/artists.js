import {
  indexGenerator,
  create as genCreate,
  update as genUpdate,
  destroy as genDestroy,
  destroyEmpty as genDestroyEmpty,
} from "./fetch";

export function index(auth) {
  return indexGenerator("artists", auth);
}

export function create(auth, artist) {
  return genCreate("artists", auth, artist);
}

export function update(auth, id, artist) {
  return genUpdate(`artists/${id}`, auth, artist);
}

export function destroy(auth, id) {
  return genDestroy(`artists/${id}`, auth);
}

export function destroyEmpty(auth) {
  return genDestroyEmpty("artists", auth);
}
