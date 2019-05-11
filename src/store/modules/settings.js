import Config from '@/config'

const settings = {
  state: {
    showRightPanel: false,
    tagsView: Config.tagsView,
    fixedHeader: Config.fixedHeader,
    sidebarLogo: Config.sidebarLogo
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      if (state.hasOwnProperty(key)) {
        state[key] = value
      }
    }
  },
  actions: {
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    }
  }
}
export default settings
