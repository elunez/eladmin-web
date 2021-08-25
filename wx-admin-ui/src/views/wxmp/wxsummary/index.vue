<!--
MIT License

Copyright (c) 2020 www.joolun.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<template>
  <div class="app-container">
      <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="demonstration">时间范围</span>
            <el-date-picker
                    format="yyyy-MM-dd"
                    v-model="dateValues"
                    type="daterange"
                    :picker-options="datePickerOptions"
                    @change="changeDate"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <el-row>
            <el-col :span="12">
              <div id="userSummaryChart" :style="{width: '80%', height: '500px'}"></div>
            </el-col>
            <el-col :span="12">
              <div id="userCumulateChart" :style="{width: '80%', height: '500px'}"></div>
            </el-col>
            <el-col :span="12">
              <div id="interfaceSummaryChart" :style="{width: '80%', height: '500px'}"></div>
            </el-col>
            <el-col :span="12">
              <div id="interfaceSummaryChart2" :style="{width: '80%', height: '500px'}"></div>
            </el-col>
          </el-row>
        </el-card>
  </div>
</template>

<script>
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  // 引入柱拆线组件
  require('echarts/lib/chart/line')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  import { getInterfaceSummary, getUserSummary, getUserCumulate } from '@/api/wxmp/wxsummary'

  export default {
    name: 'wxSummary',
    data() {
      return {
        datePickerOptions: {
          disabledDate(date) {
            return date >= new Date(new Date() - 3600 * 1000 * 24)
          }
        },
        startDate: this.$moment().add(-7,'days').format('YYYY-MM-DD'),
        endDate: this.$moment().add(-1,'days').format('YYYY-MM-DD'),
        dateValues : [this.$moment().add(-7,'days').format('YYYY-MM-DD'), this.$moment().add(-1,'days').format('YYYY-MM-DD')],
        xAxisData: [],
        seriesData1: [],
        seriesData2: [],
        seriesData3: [],
        seriesData4: [],
        seriesData5: [],
        seriesData6: [],
        seriesData7: []
      }
    },
    created() {

    },
    mounted: function() {
        this.getSummary()
    },
    computed: {

    },
    methods: {
      changeDate(){
        let startDate = new Date(this.dateValues[0])
        let endDate = new Date(this.dateValues[1])
        if (this.$moment(endDate).diff(this.$moment(startDate), 'day') > 6) {
          this.$message.error('时间间隔7天以内，请重新选择')
          return false
        }else{
          this.startDate = this.$moment(startDate).format('YYYY-MM-DD')
          this.endDate = this.$moment(endDate).format('YYYY-MM-DD')
          this.xAxisData = []
          this.seriesData1 = []
          this.seriesData2 = []
          this.seriesData5 = []
          this.seriesData6 = []
          this.getSummary()
        }
      },
      getSummary(){
        let days = this.$moment(this.endDate).diff(this.$moment(this.startDate), 'day')//相差天数
        for(let i = 0; i<= days; i++){
          this.xAxisData.push(this.$moment(this.startDate).add(i,'days').format('YYYY-MM-DD'))
          this.seriesData1.push(0)
          this.seriesData2.push(0)
          this.seriesData5.push(0)
          this.seriesData6.push(0)
        }
        getUserSummary({
          startDate: this.startDate,
          endDate: this.endDate
        }).then(response => {
          this.xAxisData.forEach((item, index, arr) => {
            response.data.forEach((item2, index2, arr2) => {
              if(item2.refDate.indexOf(item) >= 0){
                this.$set(this.seriesData5, index, this.seriesData5[index] + item2.newUser)
                this.$set(this.seriesData6, index, this.seriesData6[index] + item2.cancelUser)
              }
            })
          })
          // 基于准备好的dom，初始化echarts实例
          let userSummaryChart = echarts.init(document.getElementById('userSummaryChart'))
          // 绘制图表
          userSummaryChart.setOption({
            title: { text: '用户增减数据' },
            color: ['#67C23A', '#e5323e'],
            legend: {
              data: ['新增用户','取消关注的用户']
            },
            tooltip: {},
            xAxis: {
              data: this.xAxisData
            },
            yAxis: {},
            series: [{
              name: '新增用户',
              type: 'bar',
              label: {
                normal: {
                  show: true
                }
              },
              barGap: 0,
              data: this.seriesData5
            },
              {
                name: '取消关注的用户',
                type: 'bar',
                label: {
                  normal: {
                    show: true
                  }
                },
                data: this.seriesData6
              }]
          })
        }).catch(() => {
        })

        getUserCumulate({
          startDate: this.startDate,
          endDate: this.endDate
        }).then(response => {
          response.data.forEach((item, index, arr) => {
            this.$set(this.seriesData7, index, item.cumulateUser)
          })
          // 基于准备好的dom，初始化echarts实例
          let userCumulateChart = echarts.init(document.getElementById('userCumulateChart'))
          // 绘制图表
          userCumulateChart.setOption({
            title: { text: '累计用户数据' },
            legend: {
              data: ['累计用户量']
            },
            xAxis: {
              type: 'category',
              data: this.xAxisData
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name:'累计用户量',
              data: this.seriesData7,
              type: 'line',
              smooth: true,
              label: {
                normal: {
                  show: true
                }
              }
            }]
          })
        }).catch(() => {
        })

        //获取接口数据
        getInterfaceSummary({
          startDate: this.startDate,
          endDate: this.endDate
        }).then(response => {
          response.data.forEach((item, index, arr) => {
            this.$set(this.seriesData1, index, item.callbackCount)
            this.$set(this.seriesData2, index, item.maxTimeCost)
            this.$set(this.seriesData3, index, item.totalTimeCost)
            this.$set(this.seriesData4, index, item.failCount)
          })
          // 基于准备好的dom，初始化echarts实例
          let interfaceSummaryChart = echarts.init(document.getElementById('interfaceSummaryChart'))
          // 绘制图表
          interfaceSummaryChart.setOption({
            title: { text: '接口分析数据' },
            color: ['#67C23A', '#e5323e'],
            legend: {
              data: ['被动回复用户消息的次数','失败次数']
            },
            tooltip: {},
            xAxis: {
              data: this.xAxisData
            },
            yAxis: {},
            series: [{
              name: '被动回复用户消息的次数',
              type: 'bar',
              label: {
                normal: {
                  show: true
                }
              },
              barGap: 0,
              data: this.seriesData1
            },
            {
              name: '失败次数',
              type: 'bar',
              label: {
                normal: {
                  show: true
                }
              },
              data: this.seriesData4
            }]
          })

          // 基于准备好的dom，初始化echarts实例
          let interfaceSummaryChart2 = echarts.init(document.getElementById('interfaceSummaryChart2'))
          // 绘制图表
          interfaceSummaryChart2.setOption({
            title: { text: '接口分析数据' },
            color: ['#E6A23C', '#409EFF'],
            legend: {
              data: ['最大耗时','总耗时']
            },
            tooltip: {},
            xAxis: {
              data: this.xAxisData
            },
            yAxis: {},
            series: [
              {
                name: '最大耗时',
                type: 'bar',
                label: {
                  normal: {
                    show: true
                  }
                },
                data: this.seriesData2
              },
              {
                name: '总耗时',
                type: 'bar',
                label: {
                  normal: {
                    show: true
                  }
                },
                data: this.seriesData3
              }]
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .demonstration{
    font-size: 15px;
    margin-right: 10px;
  }
</style>
