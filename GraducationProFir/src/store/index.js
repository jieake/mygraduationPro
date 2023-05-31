import { createStore } from 'vuex'
import persistedstate from 'vuex-persistedstate'

export default createStore({
  state: {
    userinfo: {},
  },
  getters: {},
  mutations: {
    // 存储用户信息
    setUserInfo(state, payload) {
      state.userinfo = payload
    },
    // 格式化用户信息
    setUserInfoNull(state) {
      state.userinfo = {}
    },
  },
  actions: {},
  modules: {},
  plugins: [persistedstate()],
})
