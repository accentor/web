import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";

import App from "./views/App.vue";
import Artist from "./views/artists/Artist";
import Artists from "./views/artists/Artists";
import EditArtist from "./views/artists/EditArtist";
import NewArtist from "./views/artists/NewArtist";
import Home from "./views/Home";
import Login from "./views/Login";
import EditUser from "./views/users/EditUser";
import NewUser from "./views/users/NewUser";
import User from "./views/users/User";
import Users from "./views/users/Users";

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
          component: Home
        },
        {
          path: "artists",
          name: "artists",
          component: Artists
        },
        {
          path: "artists/new",
          name: "new-artist",
          component: NewArtist
        },
        {
          path: "artists/:id",
          name: "artist",
          component: Artist
        },
        {
          path: "artists/:id/edit",
          name: "edit-artist",
          component: EditArtist
        },
        {
          path: "users",
          name: "users",
          component: Users
        },
        {
          path: "users/new",
          name: "new-user",
          component: NewUser
        },
        {
          path: "users/:id",
          name: "user",
          component: User
        },
        {
          path: "users/:id/edit",
          name: "edit-user",
          component: EditUser
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        authOptional: true
      }
    },
    { path: "*", redirect: "/app/" }
  ]
});

router.beforeEach((to, from, next) => {
  const onLogin = to.matched.some(record => record.meta.authOptional);

  if (onLogin && store.getters["auth/loggedIn"]) {
    next({ name: "home" });
  } else if (onLogin || store.getters["auth/loggedIn"]) {
    next();
  } else {
    next({
      name: "login",
      query: { redirect: to.fullPath }
    });
  }
});

export default router;
