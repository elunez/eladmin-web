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
        series: {
          type: 'sankey',
          layout: 'none',
          focusNodeAdjacency: 'allEdges',
          data: [{
            name: 'a'
          }, {
            name: 'b'
          }, {
            name: 'a1'
          }, {
            name: 'a2'
          }, {
            name: 'b1'
          }, {
            name: 'c'
          }],
          links: [{
            source: 'a',
            target: 'a1',
            value: 5
          }, {
            source: 'a',
            target: 'a2',
            value: 3
          }, {
            source: 'b',
            target: 'b1',
            value: 8
          }, {
            source: 'a',
            target: 'b1',
            value: 3
          }, {
            source: 'b1',
            target: 'a1',
            value: 1
          }, {
            source: 'b1',
            target: 'c',
            value: 2
          }]
        }
      })
    }
  }
}
</script>
