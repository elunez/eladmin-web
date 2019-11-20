<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group />
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart />
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row>
      <!--      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
      <!--        <heat-map/>-->
      <!--      </el-row>-->
      <!--      <el-row :gutter="32">-->
      <!--        <el-col :xs="24" :sm="24" :lg="8">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <radar-chart/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--        <el-col :xs="24" :sm="24" :lg="8">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <sunburst/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--        <el-col :xs="24" :sm="24" :lg="8">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <gauge/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row :gutter="12">-->
      <!--        <el-col :span="12">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <rich/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--        <el-col :span="12">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <theme-river/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row :gutter="32">-->
      <!--        <el-col :xs="24" :sm="24" :lg="8">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <graph/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--        <el-col :xs="24" :sm="24" :lg="8">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <sankey/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--        <el-col :xs="24" :sm="24" :lg="8">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <line3-d/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row :gutter="12">-->
      <!--        <el-col :span="12">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <scatter/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--        <el-col :span="12">-->
      <!--          <div class="chart-wrapper">-->
      <!--            <point/>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
      <!--        <div class="chart-wrapper">-->
      <!--          <category/>-->
      <!--        </div>-->
      <!--      </el-row>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RadarChart from '@/components/Echarts/RadarChart'
import PieChart from '@/components/Echarts/PieChart'
import BarChart from '@/components/Echarts/BarChart'
import { count } from '@/api/visits'
// import HeatMap from './dashboard/HeatMap'
// import Funnel from './dashboard/Funnel'
// import Gauge from './dashboard/Gauge'
// import Rich from './dashboard/Rich'
// import ThemeRiver from './dashboard/ThemeRiver'
// import Sunburst from './dashboard/Sunburst'
// import Graph from './dashboard/Graph'
// import Sankey from './dashboard/Sankey'
// import Scatter from './dashboard/Scatter'
// import Line3D from './dashboard/Line3D'
// import Category from './dashboard/Category'
// import Point from './dashboard/Point'

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
count().then(res => {
})

export default {
  name: 'Dashboard',
  components: {
    // Point,
    // Category,
    // Graph,
    // HeatMap,
    PanelGroup,
    LineChart,
    RadarChart,
    PieChart,
    // Funnel,
    // Sunburst,
    // Gauge,
    // Rich,
    // ThemeRiver,
    // Sankey,
    // Line3D,
    // Scatter,
    BarChart
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
