import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";
import Album from "./views/albums/Album";
import Albums from "./views/albums/Albums";
import EditAlbum from "./views/albums/EditAlbum";
import NewAlbum from "./views/albums/NewAlbum";
import App from "./views/App.vue";
import Artist from "./views/artists/Artist";
import Artists from "./views/artists/Artists";
import EditArtist from "./views/artists/EditArtist";
import NewArtist from "./views/artists/NewArtist";
import Home from "./views/Home";
import Login from "./views/Login";
import Library from "./views/Library";
import EditTrack from "./views/tracks/EditTrack";
import TracksWithoutAudio from "./views/tracks/TracksWithoutAudio";
import MergeTrack from "./views/tracks/MergeTrack";
import Tracks from "./views/tracks/Tracks";
import EditUser from "./views/users/EditUser";
import NewUser from "./views/users/NewUser";
import User from "./views/users/User";
import Users from "./views/users/Users";
import Settings from "./views/settings/Settings";
import Flags from "./views/flags/Flags";
import Labels from "./views/labels/Labels";
import Label from "./views/labels/Label";
import EditLabel from "./views/labels/EditLabel";
import Genres from "./views/genres/Genres";
import Genre from "./views/genres/Genre";
import EditGenre from "./views/genres/EditGenre";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
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
          path: "settings",
          name: "settings",
          component: Settings,
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
});

store.watch(
  () => store.getters["auth/loggedIn"],
  () => {
    if (!store.getters["auth/loggedIn"]) {
      router.push({ name: "login" });
    }
  }
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
