import {
  indexGenerator,
  create as genCreate,
  read as genRead,
  update as genUpdate,
  destroy as genDestroy,
  destroyEmpty as genDestroyEmpty,
} from "./fetch";

export function index(auth, scope) {
  return indexGenerator("albums", auth, scope);
}

export function create(auth, album) {
  return genCreate("albums", auth, { album });
}

export function read(auth, id) {
  return genRead(`albums/${id}`, auth);
}

export function update(auth, id, album) {
  return genUpdate(`albums/${id}`, auth, { album });
}

export function destroy(auth, id) {
  return genDestroy(`albums/${id}`, auth);
}

export function destroyEmpty(auth) {
  return genDestroyEmpty("albums", auth);
}
