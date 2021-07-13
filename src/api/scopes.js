export class Scope {
  scopes = [];

  get finalQuery() {
    return this.scopes.map((s) => `&${s.key}=${s.query}`).join("");
  }

  addScope(key, query) {
    this.scopes.push({ key, query });
    return this;
  }

  addScopesFromArray(key, queries) {
    queries.forEach((q) => this.addScope(key, q));
    return this;
  }
}

export class AlbumsScope extends Scope {
  artist(id) {
    return this.addScope("artist_id", id);
  }

  filter(string) {
    return this.addScope("filter", string);
  }

  label(id) {
    return this.addScope("label", id);
  }

  labels(ids) {
    return this.addScopesFromArray("labels", ids);
  }
}

export class ArtistsScope extends Scope {
  filter(string) {
    return this.addScope("filter", string);
  }
}

export class TracksScope extends Scope {
  album(id) {
    return this.addScope("album_id", id);
  }

  artist(id) {
    return this.addScope("artist_id", id);
  }

  filter(string) {
    return this.addScope("filter", string);
  }

  genre(id) {
    return this.addScope("genre_id", id);
  }
}
