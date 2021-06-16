import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appName: "CloudBOX ",
    logo: require("../assets/images/logo.png"),
    darklogo: require("../assets/images/logo-white.png"),
    dark: false,
    namespaced: true,
    user: {
      name: "Bill Yerds",
      image: require("../assets/images/user/1.jpg"),
    },
  },
  mutations: {
    layoutModeCommit(state, payload) {
      state.dark = payload;
      if (!payload) {
        state.logo = require("../assets/images/logo.png");
      } else {
        state.logo = require("../assets/images/logo-white.png");
      }
    },
  },
  actions: {
    layoutModeAction(context, payload) {
      context.commit("layoutModeCommit", payload.dark);
    },
  },
  getters: {
    appName: (state) => {
      return state.appName;
    },
    logo: (state) => {
      return state.logo;
    },
    darklogo: (state) => {
      return state.darklogo;
    },
    image1: (state) => {
      return state.user.image;
    },
    name: (state) => {
      return state.user.name;
    },
    image2: (state) => {
      return state.user.image2;
    },
    image3: (state) => {
      return state.user.image3;
    },
    dark: (state) => {
      return state.dark;
    },
  },
  modules: {},
});
