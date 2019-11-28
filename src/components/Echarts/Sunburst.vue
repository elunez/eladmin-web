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
      const data = [{
        name: 'Grandpa',
        children: [{
          name: 'Uncle Leo',
          value: 15,
          children: [{
            name: 'Cousin Jack',
            value: 2
          }, {
            name: 'Cousin Mary',
            value: 5,
            children: [{
              name: 'Jackson',
              value: 2
            }]
          }, {
            name: 'Cousin Ben',
            value: 4
          }]
        }, {
          name: 'Father',
          value: 10,
          children: [{
            name: 'Me',
            value: 5
          }, {
            name: 'Brother Peter',
            value: 1
          }]
        }]
      }, {
        name: 'Nancy',
        children: [{
          name: 'Uncle Nike',
          children: [{
            name: 'Cousin Betty',
            value: 1
          }, {
            name: 'Cousin Jenny',
            value: 2
          }]
        }]
      }]
      this.chart.setOption({
        series: {
          type: 'sunburst',
          data: data,
          radius: [0, '90%'],
          label: {
            rotate: 'radial'
          }
        }
      })
    }
  }
}
</script>
