import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";

import App from "./views/App.vue";
import Artist from "./views/Artist";
import Artists from "./views/Artists";
import EditArtist from "./views/EditArtist";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import NewArtist from "./views/NewArtist";

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
    next({ path: "/app/" });
  } else if (onLogin || store.getters["auth/loggedIn"]) {
    next();
  } else {
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }
});

export default router;
