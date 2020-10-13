import {
  indexGenerator,
  create as genCreate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("auth_tokens", auth);
}

export function create(data) {
  return genCreate(`auth_tokens`, {}, { ...data });
}

export function destroy(auth, id) {
  return genDestroy(`auth_tokens/${id}`, auth);
}
