// import {http} from '../../scripts/http';

const state = {
  playlist: null,
  play: null,
  hash: null,
  current: null,
};

const getters = {
  playlist: state => {
    return state.playlist;
  },
  play: state => {
      return state.play;
  },
  hash: state => {
      return state.hash;
  },
  current: state => {
      return state.current;
  }
};

const mutations = {
  setPlaylist: (state, payload) => {
    state.playlist = payload;
  },
  setPlay: (state, payload) => {
    state.play = payload;
  },
  setHash: (state, payload) => {
    state.hash = payload;
  },
  setCurrent: (state, payload) => {
    state.current = payload;
  },

  addPlaylist: (state, payload) => {
    state.playlist.push(payload);
  },
};

const actions = {
//   GET_TODO: async (context, url) => {
//     let {data} = await http.get(url);
//     context.commit('SET_TODO', data);
//   },

//   SAVE_TODO: async (context, payload) => {
//     let {data} = await Axios.post('http://yourwebsite.com/api/todo');
//     context.commit('ADD_TODO', payload);
//   },
};

export default {
  state,
  getters,
  mutations,
  actions,
};