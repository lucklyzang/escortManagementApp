import { setStore, getStore } from '@/common/js/utils'
import { getDefaultEscortManagementState } from '@/common/js/resetStore'
export default {
    state: getDefaultEscortManagementState(),

    getters: {},

    mutations: {

        //重置保洁管理状态
        resetEscortManagementState(state) {
            Object.assign(state, getDefaultEscortManagementState())
        }
    },

    actions: {
        resetEscortManagementStore({ commit }) {
            commit('resetEscortManagementState')
        }
    }
}