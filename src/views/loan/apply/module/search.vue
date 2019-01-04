<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="输入关键字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-select v-model="query.type" clearable placeholder="搜索类型" class="filter-item" style="width: 130px">
      <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-select v-model="query.enabled" clearable placeholder="订单状态" class="filter-item" style="width: 110px" @change="toQuery">
      <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-select v-model="query.channel" clearable placeholder="资金渠道" class="filter-item" style="width: 110px" @change="toQuery">
      <el-option v-for="item in channelTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>
    <el-date-picker
      v-model="query.time"
      type="datetimerange"
      align="right"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      default-time="['00:00:00', '23:59:59']"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>

    <el-button v-if="checkPermission(['ADMIN','OPERATION_ALL','FINANCE_ALL'])" :loading="downloadLoading" size="mini" class="filter-item" type="primary" icon="el-icon-download" @click="download">导出</el-button>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils/index'

// 查询条件
export default {
  props: {
    roles: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: '订单编号' },
        { key: 'queryApplyTime', display_name: '申请时间' },
        { key: 'userName', display_name: '用户名' },
        { key: 'phone', display_name: '手机号' }
      ],
      enabledTypeOptions: [
        { key: '1', display_name: '审批中' },
        { key: '2', display_name: '审批拒绝' },
        { key: '3', display_name: '待收款' },
        { key: '4', display_name: '拒绝收款' },
        { key: '5', display_name: '确认收款' },
        { key: '6', display_name: '待放款' },
        { key: '7', display_name: '还款中' },
        { key: '8', display_name: '还款完成' },
        { key: '9', display_name: '逾期' },
        { key: '10', display_name: '放款失败' }
      ],
      channelTypeOptions: [
        { key: 'LCC201709190010', display_name: '晋商' },
        { key: 'LCC201709190009', display_name: '光大' },
        { key: 'LCC201709190008', display_name: '微言' },
        { key: 'LCC201709190007', display_name: '微商' },
        { key: 'LCC201709190006', display_name: '龙信' },
        { key: 'LCC201709190005', display_name: '京东' },
        { key: 'LCC201709190002', display_name: '众安' }
      ]
    }
  },
  methods: {
    checkPermission,
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    },
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '姓名', '手机号', '期数', '利率', '申请金额', '审批金额', '放款金额', '资金渠道', '来源渠道', '订单状态', '还款卡', '所属银行', '放款卡', '所属银行', '申请时间', '放款时间']
        const filterVal = ['id', 'userName', 'phone', 'applyTerm', 'applyRate', 'applyAmount', 'arrivalAmount', 'loanAmount', 'loanChannel', 'channelName', 'applyStatus', 'backCardNo', 'backCardName', 'loanCardNo', 'loanCardName', 'applyTime', 'loanTime']
        const data = this.formatJson(filterVal, this.$parent.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '订单信息'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'applyTime') {
          return parseTime(v[j])
        } else if (j === 'loanChannel') {
          return this.$parent.formatChannel(v[j])
        } else if (j === 'applyStatus') {
          return this.$parent.formatStatus(v[j])
        } else if (j === 'loanTime') {
          return this.$parent.checkApplyStatusTime(v)
        } else if (j === 'loanAmount') {
          return this.$parent.checkApplyStatusAmount(v)
        } else if (j === 'applyAmount' || j === 'arrivalAmount') {
          return v[j] / 100
        } else if (j === 'backCardNo') {
          return this.$parent.checkApplyStatusBackCardNo(v)
        } else if (j === 'backCardName') {
          return this.$parent.checkApplyStatusBackCardName(v)
        } else if (j === 'loanCardNo') {
          return this.$parent.checkApplyStatusLoanCardNo(v)
        } else if (j === 'loanCardName') {
          return this.$parent.checkApplyStatusLoanCardName(v)
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
