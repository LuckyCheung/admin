import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const dynamicConfig = {
  home: () => import("@/views/Home.vue"),
  login: () => import("@/views/Login.vue"),
  users: () => import(/* webpackChunkName: "group-nav" */ "@/views/Users.vue"),
  roles: () => import(/* webpackChunkName: "group-nav" */ "@/views/Roles.vue"),
  404: () => import("@/views/Error404.vue")
};

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    name: "首页",
    path: "/home",
    component: dynamicConfig["home"],
    meta: {
      requiresAuth: true
    }
  },
  {
    name: "登录",
    path: "/login",
    component: dynamicConfig["login"],
    meta: {}
  }
];

const dynamicRoutes = {
  users: {
    name: "用户列表",
    path: "/users",
    component: "users",
    meta: {
      role: [],
      requiresAuth: true,
      keepAlive: true
    }
  },
  roles: {
    name: "角色列表",
    path: "/roles",
    component: "roles",
    meta: {
      requiresAuth: true,
      keepAlive: true
    }
  },
  "404": {
    name: "404",
    path: "*",
    component: dynamicConfig["404"],
    hidden: false
  }
};

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  if (["/login"].indexOf(to.path) !== -1) {
    return next();
  }
  if (store.getters["user/isFakeLogin"]) {
    mountRouter(store.getters["user/getRouter"]);
    return next({ ...to, replace: true });
  }
  if (to.meta && to.meta.requiresAuth) {
    if (store.state.user.infoReady && store.state.user.routerReady) {
      next();
    } else {
      loginOut();
      next({
        path: "/login",
        query: { jump: to.fullPath }
      });
    }
  } else {
    next();
  }
});

function mountRouter(userRouter) {
  if (!(userRouter && userRouter.length)) return;
  userRouter = JSON.parse(JSON.stringify(userRouter));
  router.options.routes.forEach(item => {
    if (item.path === "/home") {
      userRouter.forEach(i => {
        i.component = dynamicConfig[i.component];
      });
      item.children = userRouter;
      router.addRoutes([item, dynamicRoutes["404"]]);
    }
  });
}

function matchRouter(initialRouter) {
  let r = [];
  initialRouter.forEach(item => {
    if (dynamicRoutes[item.path]) {
      r.push(dynamicRoutes[item.path]);
    }
  });
  return r;
}

function loginOut() {
  store.commit("user/resetUserInfo");
}

// router.$addRoutes = params => {
//   router.matcher = new VueRouter({ mode: "history" }).matcher;
//   router.addRoutes(params);
// };

export default router;
export { matchRouter };
