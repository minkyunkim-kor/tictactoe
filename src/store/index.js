import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isStarted: false,
    blueTeamName: "Blue Team",
    redTeamName: "Red Team",
    words: new Array(36).fill(""),
    colors: "white"
  },
  mutations: {},
  actions: {},
  modules: {}
});
