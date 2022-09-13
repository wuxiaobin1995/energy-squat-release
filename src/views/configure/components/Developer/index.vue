<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-10-21 08:41:48
 * @Description : 开发者页面
-->
<template>
  <div class="developer-container">
    <!-- 打开控制台按钮 -->
    <el-divider>控制台</el-divider>
    <el-row>
      <el-button type="primary" @click="handleOpenDev">打开控制台</el-button>
    </el-row>

    <!-- 波特率值 -->
    <el-divider>波特率值</el-divider>
    <el-input-number
      v-model="scmBaudRate"
      :min="0"
      :max="999999"
      @change="handleCheckScmBaudRate"
    ></el-input-number>
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

export default {
  name: 'Developer',

  data() {
    return {
      scmBaudRate: 115200 // 波特率值
    }
  },

  created() {
    /* 从localStorage获取波特率 */
    this.scmBaudRate = parseFloat(window.localStorage.getItem('scmBaudRate'))
  },

  methods: {
    /**
     * @description: 打开控制台按钮
     */
    handleOpenDev() {
      try {
        remote.getCurrentWebContents().openDevTools()
      } catch (err) {
        this.$message({
          type: 'error',
          message: `打开控制台失败：${err}`
        })
      }
    },

    /**
     * @description: 保存波特率值到localStorage
     */
    handleCheckScmBaudRate() {
      if (!this.scmBaudRate) {
        this.scmBaudRate = 0
      }
      window.localStorage.setItem('scmBaudRate', this.scmBaudRate)
      this.$message({
        type: 'success',
        message: '设置波特率值成功',
        duration: 1000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.developer-container {
  width: 100%;
  height: 100%;
}
</style>
