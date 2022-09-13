<!--
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-10-21 16:03:09
 * @Description : ShowChart子组件：角度与峰值功率
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
      {{ isAngleShow ? '切换峰值功率图' : '切换角度曲线图' }}
    </el-button>

    <div
      id="AngleChart"
      ref="AngleChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isAngleShow"
    />
    <div
      id="MaxPowerChart"
      ref="MaxPowerChart"
      :style="{ width: '100%', height: '90%' }"
      v-show="isMaxPowerShow"
    />
  </div>
</template>

<script>
export default {
  name: 'LineChartOne',

  props: {
    rowData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  data() {
    return {
      myChartAngle: null,
      myChartMaxPower: null,
      isAngleShow: true,
      isMaxPowerShow: true
    }
  },

  mounted() {
    this.initChart().then(() => {
      this.isMaxPowerShow = false
    })
    this.setRowData()
  },
  beforeDestroy() {
    if (this.myChartAngle) {
      this.myChartAngle.dispose() // 释放位移图表实例，释放后实例不再可用
      this.myChartAngle = null
    } else if (this.myChartMaxPower) {
      this.myChartMaxPower.dispose() // 释放峰值功率图表实例，释放后实例不再可用
      this.myChartMaxPower = null
    }
  },

  watch: {
    // 通过Props传递值
    rowData: {
      handler() {
        this.setRowData()
      },
      deep: true
    }
  },

  methods: {
    /**
     * @description: 刷新数据函数
     */
    setRowData() {
      /* 角度 */
      const newAngle = []
      if (this.rowData.angleArray.length !== 0) {
        for (let i = 0; i < this.rowData.angleArray.length; i++) {
          newAngle.push(180 - this.rowData.angleArray[i])
        }
      }

      /* 峰值功率 */
      const newMaxPower = this.rowData.maxPowerArray

      /* x轴 */
      const xAxisData = []
      for (let i = 0; i < this.rowData.angleArray.length; i++) {
        xAxisData.push((i * 0.1).toFixed(1))
      }

      /* 重新设值，刷新位移曲线图形 */
      this.myChartAngle.setOption({
        xAxis: {
          data: xAxisData
        },
        series: [
          {
            data: newAngle
          }
        ]
      })

      /* 重新设值，刷新峰值功率柱状图图形 */
      this.myChartMaxPower.setOption({
        xAxis: {
          data: []
        },
        series: [
          {
            data: newMaxPower
          }
        ]
      })
    },

    /**
     * @description: echarts配置项
     */
    initChart() {
      return new Promise((resolve, reject) => {
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
            data: ['角度曲线']
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
              name: '角度曲线',
              type: 'line',
              smooth: true,
              areaStyle: {},
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

        /* 峰值功率 */
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
            data: ['峰值功率']
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
              name: '峰值功率',
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
                name: `峰值功率图_${this.$moment().format('YYYY-MM-DD')}`
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
