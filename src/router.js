import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";
import Album from "./views/albums/Album.vue";
import Albums from "./views/albums/Albums.vue";
import EditAlbum from "./views/albums/EditAlbum.vue";
import NewAlbum from "./views/albums/NewAlbum.vue";
import App from "./views/App.vue";
import Artist from "./views/artists/Artist.vue";
import Artists from "./views/artists/Artists.vue";
import EditArtist from "./views/artists/EditArtist.vue";
import NewArtist from "./views/artists/NewArtist.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Library from "./views/Library.vue";
import Stats from "./views/Stats.vue";
import EditTrack from "./views/tracks/EditTrack.vue";
import TracksWithoutAudio from "./views/tracks/TracksWithoutAudio.vue";
import MergeTrack from "./views/tracks/MergeTrack.vue";
import Tracks from "./views/tracks/Tracks.vue";
import EditUser from "./views/users/EditUser.vue";
import NewUser from "./views/users/NewUser.vue";
import User from "./views/users/User.vue";
import Users from "./views/users/Users.vue";
import Settings from "./views/settings/Settings.vue";
import Flags from "./views/flags/Flags.vue";
import Labels from "./views/labels/Labels.vue";
import Label from "./views/labels/Label.vue";
import EditLabel from "./views/labels/EditLabel.vue";
import Genres from "./views/genres/Genres.vue";
import Genre from "./views/genres/Genre.vue";
import EditGenre from "./views/genres/EditGenre.vue";
import Playlists from "./views/playlists/Playlists.vue";
import Playlist from "./views/playlists/Playlist.vue";
import NewPlaylist from "./views/playlists/NewPlaylist.vue";
import EditPlaylist from "./views/playlists/EditPlaylist.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/app/",
      component: App,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        {
          path: "albums",
          name: "albums",
          component: Albums,
        },
        {
          path: "albums/new",
          name: "new-album",
          component: NewAlbum,
        },
        {
          path: "albums/:id",
          name: "album",
          component: Album,
          props: true,
        },
        {
          path: "albums/:id/edit",
          name: "edit-album",
          component: EditAlbum,
        },
        {
          path: "artists",
          name: "artists",
          component: Artists,
        },
        {
          path: "artists/new",
          name: "new-artist",
          component: NewArtist,
        },
        {
          path: "artists/:id",
          name: "artist",
          component: Artist,
          props: true,
        },
        {
          path: "artists/:id/edit",
          name: "edit-artist",
          component: EditArtist,
        },
        {
          path: "flags",
          name: "flags",
          component: Flags,
        },
        {
          path: "genres",
          name: "genres",
          component: Genres,
        },
        {
          path: "genres/:id",
          name: "genre",
          component: Genre,
          props: true,
        },
        {
          path: "genres/:id/edit",
          name: "edit-genre",
          component: EditGenre,
        },
        {
          path: "labels",
          name: "labels",
          component: Labels,
        },
        {
          path: "labels/:id",
          name: "label",
          component: Label,
          props: true,
        },
        {
          path: "labels/:id/edit",
          name: "edit-label",
          component: EditLabel,
        },
        {
          path: "library",
          name: "library",
          component: Library,
        },
        {
          path: "playlists",
          name: "playlists",
          component: Playlists,
        },
        {
          path: "playlists/new",
          name: "new-playlist",
          component: NewPlaylist,
        },
        {
          path: "playlists/:id",
          name: "playlist",
          component: Playlist,
          props: true,
        },
        {
          path: "playlists/:id/edit",
          name: "edit-playlist",
          component: EditPlaylist,
        },
        {
          path: "settings",
          name: "settings",
          component: Settings,
        },
        {
          path: "stats",
          name: "stats",
          component: Stats,
          props: (route) => ({ artist_id: +route.query.artist_id || null }),
        },
        {
          path: "tracks",
          name: "tracks",
          component: Tracks,
        },
        {
          path: "tracks/without-audio",
          name: "tracks-without-audio",
          component: TracksWithoutAudio,
        },
        {
          path: "tracks/:id/edit",
          name: "edit-track",
          component: EditTrack,
        },
        {
          path: "tracks/:id/merge",
          name: "merge-track",
          component: MergeTrack,
        },
        {
          path: "users",
          name: "users",
          component: Users,
        },
        {
          path: "users/new",
          name: "new-user",
          component: NewUser,
        },
        {
          path: "users/:id",
          name: "user",
          component: User,
        },
        {
          path: "users/:id/edit",
          name: "edit-user",
          component: EditUser,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        authOptional: true,
      },
    },
    { path: "*", redirect: "/app/" },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

store.watch(
  () => store.getters["auth/loggedIn"],
  () => {
    if (!store.getters["auth/loggedIn"]) {
      router.push({ name: "login" });
    }
  },
);

router.beforeEach((to, from, next) => {
  const onLogin = to.matched.some((record) => record.meta.authOptional);

  if (onLogin && store.getters["auth/loggedIn"]) {
    next({ name: "home" });
  } else if (onLogin || store.getters["auth/loggedIn"]) {
    next();
  } else {
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }
});

export default router;
