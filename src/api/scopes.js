class Scope {
  constructor() {
    this.finalQuery = "";
  }

  queryFromArray = (param, queries) => {
    queries.forEach((q) => {
      this.finalQuery += `&${param}=${q}`;
    });
    return this;
  };

  queryFromString = (param, query) => {
    if (typeof query !== "string" && typeof query !== "number") {
      // This error should only be encountered while developing
      throw TypeError(
        `You passed an ${typeof query} to a scope that expects a string or number`
      );
    }
    this.finalQuery += `&${param}=${query}`;
    return this;
  };
}

export class AlbumsScope extends Scope {
  artist = (id) => {
    return this.queryFromString("artist_id", id);
  };

  filter = (string) => {
    return this.queryFromString("filter", string);
  };

  label = (id) => {
    return this.queryFromString("label", id);
  };

  labels = (ids) => {
    return this.queryFromArray("labels", ids);
  };
}

export class ArtistsScope extends Scope {
  filter = (string) => {
    return this.queryFromString("filter", string);
  };
}

export class TracksScope extends Scope {
  album = (id) => {
    return this.queryFromString("album_id", id);
  };
  artist = (id) => {
    return this.queryFromString("artist_id", id);
  };
  filter = (string) => {
    return this.queryFromString("filter", string);
  };
  genre = (id) => {
    return this.queryFromString("genre_id", id);
  };
}
