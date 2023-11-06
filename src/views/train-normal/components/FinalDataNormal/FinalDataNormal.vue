<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2023-11-06 16:49:13
 * @Description : FinalData子组件
-->
<template>
  <div class="container">
    <!-- 单选按钮组 -->
    <el-radio-group class="select" v-model="radio" @change="handleSelect">
      <el-row class="select-row">
        <el-radio label="峰值功率" border>峰值功率</el-radio>
        <el-radio label="峰值角速度" border>峰值角速度</el-radio>
      </el-row>
      <el-row class="select-row">
        <el-radio label="平均功率" border>平均功率</el-radio>
        <el-radio label="平均角速度" border>平均角速度</el-radio>
      </el-row>
    </el-radio-group>

    <!-- 显示数据 -->
    <div class="show">
      <div class="show-main">
        <div v-show="isShowMaxAngularVelocity">
          {{ recordData.maxAngularVelocity }} rad/s
        </div>
        <div v-show="isShowMaxPower">{{ recordData.maxPower }} W</div>
        <div v-show="isShowAverageAngularVelocity">
          {{ recordData.averageAngularVelocity }} rad/s
        </div>
        <div v-show="isShowAveragePower">{{ recordData.averagePower }} W</div>
      </div>
      <div class="show-other">
        <div>百分比：{{ tireValue }} %</div>
        <div>重复次数：{{ trainCount }}</div>
        <div>
          负重：{{ parseInt(((trainWeight * 0.73) / 1.7).toFixed(0)) }} kg
        </div>
      </div>
    </div>

    <!-- logo图片 -->
    <el-image
      class="img"
      :src="require('@/assets/logo.png')"
      fit="contain"
    ></el-image>
  </div>
</template>

<script>
export default {
  name: 'FinalDataNormal',

  props: {
    // 运动重复次数
    trainCount: {
      type: Number,
      default: 0
    },
    // 功率百分比
    tireValue: {
      type: Number,
      default: 0
    },
    // 传感器所在点的负重[kg]
    trainWeight: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      isShowMaxPower: true,
      isShowMaxAngularVelocity: false,
      isShowAveragePower: false,
      isShowAverageAngularVelocity: false,
      radio: '峰值功率'
    }
  },

  computed: {
    recordData() {
      return this.$store.state.recordData
    }
  },

  methods: {
    /**
     * @description: 绑定值变化时触发的事件
     * @param {String} value 选中的单选框的值
     */
    handleSelect(value) {
      this.isShowMaxPower = false
      this.isShowMaxAngularVelocity = false
      this.isShowAveragePower = false
      this.isShowAverageAngularVelocity = false
      switch (value) {
        case '峰值功率':
          this.isShowMaxPower = true
          break
        case '峰值角速度':
          this.isShowMaxAngularVelocity = true
          break
        case '平均功率':
          this.isShowAveragePower = true
          break
        case '平均角速度':
          this.isShowAverageAngularVelocity = true
          break
        default:
          this.radio = '峰值功率'
          this.isShowMaxPower = true
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .select {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #cacbcc;
    .select-row {
      margin: 12px 0;
    }
  }

  .show {
    background-color: #606266;
    .show-main {
      padding-right: 5px;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 66px;
      text-align: right;
      color: #f82727;
    }
    .show-other {
      font-size: 22px;
      color: #ffffff;
      padding-left: 5px;
      margin-bottom: 8px;
    }
  }

  .img {
    flex-grow: 1;
  }
}
</style>
