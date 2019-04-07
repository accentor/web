import Vue from "vue";
import Router from "vue-router";
import App from "./views/App.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import store from "./store/store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/app",
      component: App,
      children: [
        {
          path: "/",
          name: "home",
          component: Home
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

  if (onLogin && store.getters.loggedIn) {
    next({ path: "/app/" });
  } else if (onLogin || store.getters.loggedIn) {
    next();
  } else {
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }
});

export default router;
