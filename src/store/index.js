import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import shop from "./modules/shop";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  modules: { user, shop }
});
