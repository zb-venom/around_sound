import Vue from 'vue';
import Vuex from 'vuex';
import playlist from './modules/playlist'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    playlist,
  },
});