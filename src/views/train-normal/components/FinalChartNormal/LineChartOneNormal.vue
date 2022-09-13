<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-10-21 15:59:18
 * @Description : LineChart子组件：角度与峰值功率
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
      {{ isMaxPowerShow ? '切换角度曲线图' : '切换峰值功率图' }}
    </el-button>

    <div
      id="MaxPowerChart"
      ref="MaxPowerChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isMaxPowerShow"
    />
    <div
      id="AngleChart"
      ref="AngleChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isAngleShow"
    />
  </div>
</template>

<script>
export default {
  name: 'LineChartOneNormal',

  data() {
    return {
      myChartMaxPower: null,
      myChartAngle: null,
      isMaxPowerShow: true,
      isAngleShow: true
    }
  },

  mounted() {
    this.initChart().then(() => {
      this.isAngleShow = false
    })
  },
  beforeDestroy() {
    if (this.myChartAngle) {
      this.myChartAngle.dispose() // 释放位移图表实例，释放后实例不再可用
      this.myChartAngle = null
    } else if (this.myChartMaxPower) {
      this.myChartMaxPower.dispose() // 释放最大功率图表实例，释放后实例不再可用
      this.myChartMaxPower = null
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
        /* 角度 */
        const newAngle = []
        if (newValue.angleArray.length !== 0) {
          for (let i = 0; i < newValue.angleArray.length; i++) {
            newAngle.push(180 - newValue.angleArray[i])
          }
        }
        const oldAngle = []
        if (oldValue.angleArray.length !== 0) {
          for (let i = 0; i < oldValue.angleArray.length; i++) {
            oldAngle.push(180 - oldValue.angleArray[i])
          }
        }

        /* x轴 */
        const xAxisData = []
        // 以时间较长者作为x坐标长
        if (newValue.angleArray.length >= oldValue.angleArray.length) {
          for (let i = 0; i < newValue.angleArray.length; i++) {
            xAxisData.push((i * 0.1).toFixed(1))
          }
        } else {
          for (let i = 0; i < oldValue.angleArray.length; i++) {
            xAxisData.push((i * 0.1).toFixed(1))
          }
        }

        /* 重新设值，刷新最大功率柱状图图形 */
        this.myChartMaxPower.setOption({
          xAxis: {
            data: []
          },
          series: [
            {
              data: [newValue.maxPower]
            },
            {
              data: [oldValue.maxPower]
            }
          ]
        })

        /* 重新设值，刷新角度曲线图形 */
        this.myChartAngle.setOption({
          xAxis: {
            data: xAxisData
          },
          series: [
            {
              data: newAngle
            },
            {
              data: oldAngle
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
        /* 最大功率 */
        this.myChartMaxPower = this.$echarts.init(
          document.getElementById('MaxPowerChart')
        )
        this.myChartMaxPower.setOption({
          /* 标题栏。包含主标题和副标题 */
          title: {
            text: '峰值功率柱状图', // 主标题
            subtext: '峰值功率[W]' // 副标题
          },
          /* 图例。展现了不同系列的标记(symbol)，颜色和名字 */
          legend: {
            data: ['新功率', '旧功率']
          },
          /* 直角坐标系 grid 中的 x 轴 */
          xAxis: [
            {
              type: 'category',
              data: []
            }
          ],
          /* 直角坐标系 grid 中的 y 轴 */
          yAxis: [
            {
              type: 'value'
            }
          ],
          /* 系列列表。每个系列通过 type 决定自己的图表类型 */
          series: [
            {
              name: '新功率',
              type: 'bar',
              label: {
                show: true,
                textStyle: {
                  fontSize: 30
                }
              },
              data: []
            },
            {
              name: '旧功率',
              type: 'bar',
              label: {
                show: true,
                textStyle: {
                  fontSize: 30
                }
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
                name: `最大功率图_${this.$moment().format('YYYY-MM-DD')}`
              },
              restore: {} // 重置
            }
          },
          /* 是否开启动画效果 */
          animation: true
        })

        /* 角度 */
        this.myChartAngle = this.$echarts.init(
          document.getElementById('AngleChart')
        )
        this.myChartAngle.setOption({
          /* 标题栏。包含主标题和副标题 */
          title: {
            text: '角度曲线图', // 主标题
            subtext: '角度[°]' // 副标题
          },
          /* 提示框 */
          tooltip: {
            trigger: 'axis' // 触发类型：坐标轴触发
          },
          /* 图例。展现了不同系列的标记(symbol)，颜色和名字 */
          legend: {
            data: ['新角度曲线', '旧角度曲线']
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
              name: '新角度曲线',
              type: 'line',
              smooth: true,
              areaStyle: {},
              markPoint: {
                symbolSize: 68,
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              },
              data: []
            },
            {
              name: '旧角度曲线',
              type: 'line',
              smooth: true,
              markPoint: {
                symbolSize: 68,
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
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
                name: `角度曲线图_${this.$moment().format('YYYY-MM-DD')}`
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
      this.isAngleShow = !this.isAngleShow
      this.isMaxPowerShow = !this.isMaxPowerShow
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
