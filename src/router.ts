import {
  createRouter,
  createWebHistory,
  type RouterScrollBehavior,
} from "vue-router";
import { useAuthStore } from "./store/auth";
import App from "@/views/App.vue";
import Home from "@/views/Home.vue";
import Albums from "@/views/albums/Albums.vue";
import NewAlbum from "@/views/albums/NewAlbum.vue";
import Album from "@/views/albums/Album.vue";
import EditAlbum from "@/views/albums/EditAlbum.vue";
import Artists from "@/views/artists/Artists.vue";
import NewArtist from "@/views/artists/NewArtist.vue";
import Artist from "@/views/artists/Artist.vue";
import EditArtist from "@/views/artists/EditArtist.vue";
import Flags from "@/views/flags/Flags.vue";
import Genres from "@/views/genres/Genres.vue";
import Genre from "@/views/genres/Genre.vue";
import EditGenre from "@/views/genres/EditGenre.vue";
import Labels from "@/views/labels/Labels.vue";
import Label from "@/views/labels/Label.vue";
import EditLabel from "@/views/labels/EditLabel.vue";
import Library from "@/views/Library.vue";
import Playlists from "@/views/playlists/Playlists.vue";
import NewPlaylist from "@/views/playlists/NewPlaylist.vue";
import Playlist from "@/views/playlists/Playlist.vue";
import EditPlaylist from "@/views/playlists/EditPlaylist.vue";
import Settings from "@/views/settings/Settings.vue";
import Stats from "@/views/Stats.vue";
import Tracks from "@/views/tracks/Tracks.vue";
import TracksWithoutAudio from "@/views/tracks/TracksWithoutAudio.vue";
import EditTrack from "@/views/tracks/EditTrack.vue";
import MergeTrack from "@/views/tracks/MergeTrack.vue";
import Users from "@/views/users/Users.vue";
import NewUser from "@/views/users/NewUser.vue";
import User from "@/views/users/User.vue";
import EditUser from "@/views/users/EditUser.vue";
import Login from "@/views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          props: true,
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
          props: true,
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
          props: true,
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
          props: true,
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
          props: (route) => ({ artistId: route.query.artist_id }),
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
          props: true,
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
          props: true,
        },
        {
          path: "users/:id/edit",
          name: "edit-user",
          component: EditUser,
          props: true,
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
    { path: "/:catchAll(.*)", redirect: "/app/" },
  ],
  scrollBehavior: ((to, from, savedPosition) => {
    if (to.path === from.path) {
      return savedPosition || { x: 0, y: 0 };
    } else {
      return { x: 0, y: 0 };
    }
  }) as RouterScrollBehavior,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const onLogin = to.matched.some((record) => record.meta.authOptional);

  if (onLogin && authStore.loggedIn) {
    next({ name: "home" });
  } else if (onLogin || authStore.loggedIn) {
    next();
  } else {
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }
});

export default router;
