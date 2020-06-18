import {
  indexGenerator,
  create as genCreate,
  update as genUpdate,
  destroy as genDestroy,
} from "./fetch";

export function index(auth) {
  return indexGenerator("codec_conversions", auth);
}

export function create(auth, codec_conversion) {
  return genCreate("codec_conversions", auth, codec_conversion);
}

export function update(auth, id, codec_conversion) {
  return genUpdate(`codec_conversions/${id}`, auth, codec_conversion);
}

export function destroy(auth, id) {
  return genDestroy(`codec_conversions/${id}`, auth);
}
