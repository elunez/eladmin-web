<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'

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
      const data = []
      for (let t = 0; t < 25; t += 0.001) {
        const x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t)
        const y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t)
        const z = t + 2.0 * Math.sin(75 * t)
        data.push([x, y, z])
      }
      this.chart.setOption({
        tooltip: {},
        backgroundColor: '#fff',
        visualMap: {
          show: false,
          dimension: 2,
          min: 0,
          max: 30,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        xAxis3D: {
          type: 'value'
        },
        yAxis3D: {
          type: 'value'
        },
        zAxis3D: {
          type: 'value'
        },
        grid3D: {
          viewControl: {
            projection: 'orthographic'
          }
        },
        series: [{
          type: 'line3D',
          data: data,
          lineStyle: {
            width: 4
          }
        }]
      })
    }
  }
}
</script>
