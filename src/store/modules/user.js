import { matchRouter } from "@/router";

const state = () => ({
  userInfo: {
    name: "",
    id: "",
    mobile: "",
    email: "",
    token: "",
    router: []
  },
  infoReady: false,
  routerReady: false
});

const getters = {
  isFakeLogin(state) {
    let userInfo = localStorage.getItem("user_info");
    if (!state.routerReady && !state.infoReady && userInfo) {
      return true;
    } else {
      return false;
    }
  },
  getToken(state) {
    if (state.infoReady) {
      return state.userInfo.token;
    }
    let userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      state.userInfo = userInfo;
      state.infoReady = true;
      state.routerReady = true;
      return userInfo.token;
    } else {
      return "";
    }
  },
  getRouter(state) {
    if (state.routerReady) {
      return state.userInfo.router;
    }
    let userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      state.userInfo = userInfo;
      state.infoReady = true;
      state.routerReady = true;
      return userInfo.router;
    } else {
      return [];
    }
  }
};
const actions = {};
const mutations = {
  setUserInfo(state, { uInfo, uRouter }) {
    if (uInfo) {
      for (let i in state.userInfo) {
        state.userInfo[i] = uInfo[i] || "";
      }
      state.infoReady = true;
    }
    if (uRouter && uRouter.length) {
      let r = [];
      uRouter.forEach(item => {
        if (item.children && item.children.length) {
          r.push(...item.children);
        }
      });
      state.userInfo.router = matchRouter(r);
      state.routerReady = true;
    }
    localStorage.setItem("user_info", JSON.stringify(state.userInfo));
  },
  resetUserInfo(state) {
    state.userInfo = {
      name: "",
      id: "",
      mobile: "",
      email: "",
      token: "",
      router: []
    };
    state.infoReady = false;
    state.routerReady = false;
    localStorage.setItem("user_info", "");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
