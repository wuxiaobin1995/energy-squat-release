/*
 * @Author      : 吴晓斌
 * @Date        : 2020-10-16 09:37:59
 * @LastEditTime: 2020-10-21 11:48:02
 * @Description : Vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /* 普通模式 */
    recordData: {
      angleArray: [], // 角度[°]
      angularVelocityArray: [], // 角速度[rad/s]
      powerDataArray: [], // 瞬时功率数组[W]
      maxPower: 0, // 峰值功率[W]
      averagePower: 0, // 平均功率[W]
      maxAngularVelocity: 0, // 峰值角速度[rad/s]
      averageAngularVelocity: 0 // 平均角速度[rad/s]
    },
    /* 组次模式 */
    recordData2: {
      speedDataArray: [], // 瞬时速度数组[cm/s]
      distanceDataArray: [], // 瞬时位移数组[mm]
      powerDataArray: [], // 瞬时功率数组[W]
      maxPower: 0, // 峰值功率[W]
      maxSpeed: 0, // 峰值速度[m/s]
      averagePower: 0, // 平均功率[W]
      averageSpeed: 0, // 平均速度[m/s]
      maxPowerArray: [] // 峰值功率数组[W]
    }
  },
  mutations: {
    /* 普通模式 */
    CHANGE_RECORDDATA(state, newRecordData) {
      state.recordData = newRecordData
    },
    /* 组次模式 */
    CHANGE_RECORDDATA_2(state, newRecordData2) {
      state.recordData2 = newRecordData2
    }
  },
  actions: {
    /* 普通模式 */
    changeRecordData({ commit }, newRecordData) {
      commit('CHANGE_RECORDDATA', newRecordData)
    },
    /* 组次模式 */
    changeRecordData2({ commit }, newRecordData2) {
      commit('CHANGE_RECORDDATA_2', newRecordData2)
    }
  }
})
