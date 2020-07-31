const state = () => ({
  userInfo: {
    name: "",
    id: "",
    mobile: "",
    email: "",
    token: "",
    ready: false
  },
  globalToken: ""
});

const getters = {
  globalTokenGetters(state) {
    return state.userInfo.token || localStorage.getItem("token") || "";
  }
};
const actions = {};
const mutations = {
  updateUserInfo(state, userInfo) {
    if (!userInfo) return;
    for (let i in state.userInfo) {
      state.userInfo[i] = userInfo[i] || "";
    }
    state.userInfo.ready = true;
    localStorage.setItem("token", userInfo.token || "");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
