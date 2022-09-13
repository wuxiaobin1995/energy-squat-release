<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-10-21 16:01:41
 * @Description : LineChart子组件：角速度与功率
-->
<template>
  <div class="container">
    <el-button
      class="btn"
      type="success"
      round
      size="small"
      @click="handleShow"
    >
      {{ isPowerShow ? '切换角速度曲线图' : '切换功率曲线图' }}
    </el-button>

    <div
      id="PowerChart"
      ref="PowerChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isPowerShow"
    />
    <div
      id="AngularVelocityChart"
      ref="AngularVelocityChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isAngularVelocityShow"
    />
  </div>
</template>

<script>
export default {
  name: 'LineChartTwoNormal',

  data() {
    return {
      myChartPower: null,
      myChartAngularVelocity: null,
      isPowerShow: true,
      isAngularVelocityShow: true
    }
  },

  mounted() {
    this.initChart().then(() => {
      this.isAngularVelocityShow = false
    })
  },
  beforeDestroy() {
    if (this.myChartPower) {
      this.myChartPower.dispose() // 释放功率图表实例，释放后实例不再可用
      this.myChartPower = null
    } else if (this.myChartAngularVelocity) {
      this.myChartAngularVelocity.dispose() // 释放速度图表实例，释放后实例不再可用
      this.myChartAngularVelocity = null
    }
  },

  computed: {
    // 通过Vuex传递值
    recordData() {
      return this.$store.state.recordData
    }
  },

  watch: {
    recordData: {
      handler(newValue, oldValue) {
        /* 功率 */
        const newPowerDataArray = newValue.powerDataArray
        const oldPowerDataArray = oldValue.powerDataArray

        /* 角速度 */
        const newAngularVelocityDataArray = newValue.angularVelocityArray
        const oldAngularVelocityDataArray = oldValue.angularVelocityArray

        /* x轴 */
        const xAxisData = []
        if (
          newValue.angularVelocityArray.length >=
          oldValue.angularVelocityArray.length
        ) {
          for (let i = 0; i < newPowerDataArray.length; i++) {
            xAxisData.push((i * 0.1).toFixed(1))
          }
        } else {
          for (let i = 0; i < oldPowerDataArray.length; i++) {
            xAxisData.push((i * 0.1).toFixed(1))
          }
        }

        /* 重新设值，刷新功率曲线图形 */
        this.myChartPower.setOption({
          xAxis: {
            data: xAxisData
          },
          series: [
            {
              data: newPowerDataArray
            },
            {
              data: oldPowerDataArray
            }
          ]
        })

        /* 重新设值，刷新角速度曲线图形 */
        this.myChartAngularVelocity.setOption({
          xAxis: {
            data: xAxisData
          },
          series: [
            {
              data: newAngularVelocityDataArray
            },
            {
              data: oldAngularVelocityDataArray
            }
          ]
        })
      },
      deep: true
    }
  },

  methods: {
    /**
     * @description: echarts配置项
     */
    initChart() {
      return new Promise((resolve, reject) => {
        /* 功率 */
        this.myChartPower = this.$echarts.init(
          document.getElementById('PowerChart')
        )
        this.myChartPower.setOption({
          /* 标题栏。包含主标题和副标题 */
          title: {
            text: '功率曲线图', // 主标题
            subtext: '功率[W]' // 副标题
          },
          /* 提示框 */
          tooltip: {
            trigger: 'axis' // 触发类型：坐标轴触发
          },
          /* 图例。展现了不同系列的标记(symbol)，颜色和名字 */
          legend: {
            data: ['新功率曲线', '旧功率曲线']
          },
          /* 直角坐标系 grid 中的 x 轴 */
          xAxis: [
            {
              name: 't/s',
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          /* 直角坐标系 grid 中的 y 轴 */
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          /* 系列列表。每个系列通过 type 决定自己的图表类型 */
          series: [
            {
              name: '新功率曲线',
              type: 'line',
              smooth: true,
              areaStyle: {},
              markPoint: {
                symbolSize: 68,
                data: [{ type: 'max', name: '最大值' }]
              },
              data: []
            },
            {
              name: '旧功率曲线',
              type: 'line',
              smooth: true,
              markPoint: {
                symbolSize: 68,
                data: [{ type: 'max', name: '最大值' }]
              },
              data: []
            }
          ],
          /* 工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具 */
          toolbox: {
            show: true,
            feature: {
              // 导出图片
              saveAsImage: {
                name: `功率曲线图_${this.$moment().format('YYYY-MM-DD')}`
              },
              restore: {} // 重置
            }
          },
          /* 是否开启动画效果 */
          animation: true
        })

        /* 角速度 */
        this.myChartAngularVelocity = this.$echarts.init(
          document.getElementById('AngularVelocityChart')
        )
        this.myChartAngularVelocity.setOption({
          /* 标题栏。包含主标题和副标题 */
          title: {
            text: '角速度曲线图', // 主标题
            subtext: '角速度[rad/s]' // 副标题
          },
          /* 提示框 */
          tooltip: {
            trigger: 'axis' // 触发类型：坐标轴触发
          },
          /* 图例。展现了不同系列的标记(symbol)，颜色和名字 */
          legend: {
            data: ['新角速度曲线', '旧角速度曲线']
          },
          /* 直角坐标系 grid 中的 x 轴 */
          xAxis: [
            {
              name: 't/s',
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          /* 直角坐标系 grid 中的 y 轴 */
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          /* 系列列表。每个系列通过 type 决定自己的图表类型 */
          series: [
            {
              name: '新角速度曲线',
              type: 'line',
              smooth: true,
              areaStyle: {},
              markPoint: {
                symbolSize: 68,
                data: [{ type: 'max', name: '最大值' }]
              },
              data: []
            },
            {
              name: '旧角速度曲线',
              type: 'line',
              smooth: true,
              markPoint: {
                symbolSize: 68,
                data: [{ type: 'max', name: '最大值' }]
              },
              data: []
            }
          ],
          /* 工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具 */
          toolbox: {
            show: true,
            feature: {
              // 导出图片
              saveAsImage: {
                name: `角速度曲线图_${this.$moment().format('YYYY-MM-DD')}`
              },
              restore: {} // 重置
            }
          },
          /* 是否开启动画效果 */
          animation: true
        })

        return resolve()
      })
    },

    /**
     * @description: 切换图形按钮
     */
    handleShow() {
      this.isPowerShow = !this.isPowerShow
      this.isAngularVelocityShow = !this.isAngularVelocityShow
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .btn {
    margin-left: 5px;
  }
}
</style>
