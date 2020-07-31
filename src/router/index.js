import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Users from "@/views/Users.vue";
import Roles from "@/views/Roles.vue";
import Error404 from "@/views/Error404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    name: "首页",
    path: "/home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: "登录",
    path: "/login",
    component: Login,
    meta: {}
  },
  {
    name: "404",
    path: "*",
    component: Error404,
    hidden: false
  }
];

export const dynamicRoutes = {
  "/users": {
    name: "用户列表",
    path: "/users",
    component: Users,
    meta: {
      role: [],
      requiresAuth: true,
      keepAlive: true
    }
  },
  "/roles": {
    name: "角色列表",
    path: "/roles",
    component: Roles,
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  }
};

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login" || to.path === "/404") {
    next();
  } else if (to.meta && to.meta.requiresAuth) {
    if (store.getters["user/globalTokenGetters"]) {
      if (to.path === "/home") {
        store.dispatch("router/updateRouterAsync").then(() => {
          let { routes } = router.options;
          let routeData = routes.find(r => r.path === to.path);
          routeData.children = store.state.router.routerList;
          router.addRoutes([routeData]);
          next();
        });
      } else {
        next();
      }
    } else {
      next({
        path: "/login",
        query: { jump: to.fullPath }
      });
    }
  } else {
    next();
  }
});

export default router;
