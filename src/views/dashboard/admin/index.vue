<template>
  <div class="dashboard-editor-container">

    <github-corner style="position: absolute; top: 0px; border: 0; right: 0;"/>

    <panel-group :count="count"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart/>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { get } from '@/api/visits'
export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      count: { newIp: 0, newVisits: 0, recentIp: 0, recentVisits: 0 }
    }
  },
  mounted() {
    get().then(res => {
      this.count.newIp = res.newIp
      this.count.newVisits = res.newVisits
      this.count.recentIp = res.recentIp
      this.count.recentVisits = res.recentVisits
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
