# Accentor web frontend

Web frontend for Accentor, a modern music server focusing on metadata.

## Why use Accentor?

Accentor gives you complete control over your music. You can build
your own collection (with good old CD's, bandcamp downloads, ...) in
the sound quality that you want and stream it either through this web
frontend or the [android app](https://github.com/accentor/android).

Accentor is focused on metadata. We allow you to add detailed metadata
to your music collection, beyond what the tags inside an audio file
are capable of. Album and tracks can have multiple artists with a
different name on different albums/tracks, albums can have multiple
labels and tracks can have multiple genres.

The metadata is completely in your control: you can edit it however you want.

## How to deploy

To use the web frontend, you already need to have an API running. You
can read how to do that [here](https://github.com/accentor/api).

Once you have the API running, you have two options for the frontend.

### Use a hosting service for static sites

The project can be deployed to a static site hoster like Netlify.
You only need the following three things:
* An environment variable for `VITE_API_URL` pointing to the domain of your api.
* Build command: `yarn build`.
* Output directory: `dist/`.

### Deploy on the same domain as the API

To deploy on the same domain as the API, build the frontend using
`yarn build`. The result in `dist` should be the root for your web
server. Make sure to proxy requests to `/api/*` and `/rails/*` to your
API server. `/index.html` should be served instead of a 404 to make
sure the navigation in the SPA works correctly.

## Local development

To run and develop locally:
1. Install all dependencies with `yarn install`.
2. Compile with hot-reloads using `yarn run serve`.

You will also need an API to interact with. For this you can
* [Run the API locally](https://github.com/accentor/api) (Recommended)
* Set an environment variable for `VITE_API_URL` pointing to an
  existing API.

## Help

Have a question? You can ask it through [GitHub
discussions](https://github.com/accentor/web/discussions) or in the
[Matrix channel](https://matrix.to/#/!PCYHOaWItkVRNacTSv:vanpetegem.me?via=vanpetegem.me&via=matrix.org).

Think you have noticed a bug or have a great idea for a feature?
[Create an issue](https://github.com/accentor/web/issues/new/choose).

## Known issues

### Playback support depends on browser
Playback of audio files depends on browser support entirely. This can
cause three issues:
1. No support for a codec: Not all browsers support all codecs, see
   [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs)
   for a detailed guide.
2. Faulty encoding: a file that isn't encoded correctly might play in
   one browser, but not in another. (For example, Chromium-based
   browsers seems to be stricter to FLAC than FF.)
3. Problems with the browser: A browser can always have an internal
   problem with playback. Most notably [Firefox < 76 had problems
   playing
   FLAC.](https://bugzilla.mozilla.org/show_bug.cgi?id=1528265)

### Memory usage

Since the frontend stores all tracks, albums, artists, ... locally,
the memory usage will grow as your collection grows. At the moment we
can keep memory usage below 100MB for substantial libraries. We'll
continue to monitor this, so the memory usage doesn't grow more than
necessary.
