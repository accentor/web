import { create as genCreate } from "./fetch";

export function create(auth, play) {
  return genCreate(`plays`, auth, { play });
}
