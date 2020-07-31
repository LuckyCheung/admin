import { dynamicRoutes } from "@/router";
import api from "@/utils/api";

const state = () => ({
  routerList: [],
  ready: false
});

const getters = {};
const actions = {
  async updateRouterAsync({ commit }) {
    let res = await api.getMenu();
    if (res && res.data) {
      commit("updateRouterSync", res.data.data);
      return true;
    } else {
      return false;
    }
  }
};
const mutations = {
  updateRouterSync(state, routerList) {
    let r = [];
    routerList.forEach(item => {
      if (item.children) {
        item.children.forEach(i => {
          if (dynamicRoutes[`/${i.path}`]) {
            r.push(dynamicRoutes[`/${i.path}`]);
          }
        });
      }
    });
    state.routerList = r;
    state.ready = true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
