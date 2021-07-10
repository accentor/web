import { indexGenerator, create as genCreate } from "./fetch";

export function index(auth) {
  return indexGenerator("plays", auth);
}

export function create(auth, play) {
  return genCreate("plays", auth, { play });
}
