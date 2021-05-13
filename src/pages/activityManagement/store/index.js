export default {
  namespaced: true,
  state: {
    activity: {
      class: []
    },
  },
  getters: {
    getActivityClasses: state => {
      if (state.activity && state.activity.class) {
        return [].concat(state.activity.class);
      }
    },
    getActivity: state => state.activity
  },
  mutations: {
    saveActivity: (state, obj) => {
      state.activity = obj
    },
    saveActivityProps: (state, obj) => {
      state.activity = {...state.activity, ...obj};
    },
    clearActivity (state) {
      state.activity = { class: [] };
    }
  },
  actions: {
    loadActivity ({ commit }, {loadFun, makeUp, user}) {
      return loadFun().then(res => {
        if (res.code === 10000) {
          commit('saveActivity', makeUp(res.data, user))
        } else {
          throw new Error(res.msg);
        }
      })
    }
  }
}