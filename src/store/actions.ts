import type { Scope } from "@accentor/api-client-js";

export async function fetchAll<T>(
  generator: AsyncGenerator<T[], T[], void>,
  add: (items: T[]) => void,
  setStartLoading: () => void,
  removeOld: () => void,
  scope?: Scope,
) {
  if (!scope || scope.scopes.length === 0) {
    setStartLoading();
  }
  let done: boolean | undefined = false;
  let results = [];
  let counter = 0;
  while (!done) {
    let value = [];
    ({ value, done } = await generator.next());
    results.push(...value);
    if (++counter % 5 === 0) {
      add(results);
      results = [];
    }
  }
  add(results);
  if (!scope || scope.scopes.length === 0) {
    removeOld();
  }
}
