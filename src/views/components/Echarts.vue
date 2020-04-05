<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <heat-map />
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <sunburst />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <gauge />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <div class="chart-wrapper">
            <rich />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper">
            <theme-river />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <graph />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <sankey />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <line3-d />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <div class="chart-wrapper">
            <scatter />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper">
            <point />
          </div>
        </el-col>
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="chart-wrapper">
          <word-cloud />
        </div>
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="chart-wrapper">
          <category />
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import RadarChart from '@/components/Echarts/RadarChart'
import HeatMap from '@/components/Echarts/HeatMap'
import Gauge from '@/components/Echarts/Gauge'
import Rich from '@/components/Echarts/Rich'
import ThemeRiver from '@/components/Echarts/ThemeRiver'
import Sunburst from '@/components/Echarts/Sunburst'
import Graph from '@/components/Echarts/Graph'
import Sankey from '@/components/Echarts/Sankey'
import Scatter from '@/components/Echarts/Scatter'
import Line3D from '@/components/Echarts/Line3D'
import Category from '@/components/Echarts/Category'
import Point from '@/components/Echarts/Point'
import WordCloud from '@/components/Echarts/WordCloud'

export default {
  name: 'Echarts',
  components: {
    Point,
    Category,
    Graph,
    HeatMap,
    RadarChart,
    Sunburst,
    Gauge,
    Rich,
    ThemeRiver,
    Sankey,
    Line3D,
    Scatter,
    WordCloud
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
