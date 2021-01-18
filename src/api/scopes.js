export class Scope {
  scopes = [];

  get finalQuery() {
    return this.scopes.map((s) => `&${s.key}=${s.query}`).join("");
  }

  addScope = (key, query) => {
    if (typeof query !== "string" && typeof query !== "number") {
      throw TypeError(
        `${query} is an ${typeof query} while your scope '${key}' that expects a string or number.`
      );
    }
    this.scopes.push({ key, query });
    return this;
  };

  addScopesFromArray = (key, queries) => {
    if (!Array.isArray(queries)) {
      throw TypeError(
        `${queries} is an ${typeof queries} while your scope '${key}' that expects an array with strings or numbers.`
      );
    }
    try {
      queries.forEach((q) => this.addScope(key, q));
    } catch (e) {
      throw TypeError(
        `One of the values in your array is not a string or number:\n${e.message}`
      );
    }
    return this;
  };
}

export class AlbumsScope extends Scope {
  artist = (id) => {
    return this.addScope("artist_id", id);
  };

  filter = (string) => {
    return this.addScope("filter", string);
  };

  label = (id) => {
    return this.addScope("label", id);
  };

  labels = (ids) => {
    return this.addScopesFromArray("labels", ids);
  };
}

export class ArtistsScope extends Scope {
  filter = (string) => {
    return this.addScope("filter", string);
  };
}

export class TracksScope extends Scope {
  album = (id) => {
    return this.addScope("album_id", id);
  };
  artist = (id) => {
    return this.addScope("artist_id", id);
  };
  filter = (string) => {
    return this.addScope("filter", string);
  };
  genre = (id) => {
    return this.addScope("genre_id", id);
  };
}
