import {
  indexGenerator,
  create as genCreate,
  update as genUpdate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("image_types", auth);
}

export function create(auth, image_type) {
  return genCreate("image_types", auth, { image_type });
}

export function update(auth, id, image_type) {
  return genUpdate(`image_types/${id}`, auth, { image_type });
}

export function destroy(auth, id) {
  return genDestroy(`image_types/${id}`, auth);
}
