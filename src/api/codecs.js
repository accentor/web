import {
  indexGenerator,
  create as genCreate,
  update as genUpdate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("codecs", auth);
}

export function create(auth, codec) {
  return genCreate("codecs", auth, codec);
}

export function update(auth, id, codec) {
  return genUpdate(`codecs/${id}`, auth, codec);
}

export function destroy(auth, id) {
  return genDestroy(`codecs/${id}`, auth);
}
