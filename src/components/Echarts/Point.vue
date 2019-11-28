<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: 'Graph 简单示例'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
              normal: {
                show: true
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            data: [{
              name: '节点1',
              x: 100,
              y: 300
            }, {
              name: '节点2',
              x: 1000,
              y: 300
            }, {
              name: '节点3',
              x: 550,
              y: 100
            }, {
              name: '节点4',
              x: 550,
              y: 500
            }],
            // links: [],
            links: [{
              source: 0,
              target: 1,
              symbolSize: [5, 20],
              label: {
                normal: {
                  show: true
                }
              },
              lineStyle: {
                normal: {
                  width: 5,
                  curveness: 0.2
                }
              }
            }, {
              source: '节点2',
              target: '节点1',
              label: {
                normal: {
                  show: true
                }
              },
              lineStyle: {
                normal: { curveness: 0.2 }
              }
            }, {
              source: '节点1',
              target: '节点3'
            }, {
              source: '节点2',
              target: '节点3'
            }, {
              source: '节点2',
              target: '节点4'
            }, {
              source: '节点1',
              target: '节点4'
            }],
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 2,
                curveness: 0
              }
            }
          }
        ]
      })
    }
  }
}
</script>
