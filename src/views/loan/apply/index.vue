<template>
  <div class="app-container">
    <search :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyStatus" label="期数">
        <template slot-scope="scope">
          <span>{{ scope.row.applyTerm }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyRate" label="利率">
        <template slot-scope="scope">
          <span>{{ scope.row.applyRate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="申请金额">
        <template slot-scope="scope">
          <span>{{ scope.row.applyAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="arrivalAmount" label="审批金额">
        <template slot-scope="scope">
          <span>{{ scope.row.arrivalAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanAmount" label="放款金额">
        <template slot-scope="scope" >
          <span>{{ checkApplyStatusAmount(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanChannel" label="资金渠道">
        <template slot-scope="scope">
          <span>{{ formatChannel(scope.row.loanChannel) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="channelId" label="来源渠道">
        <template slot-scope="scope">
          <span>{{ scope.row.channelId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyStatus" label="订单状态">
        <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.applyStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="backCardNo" label="还款卡">
        <template slot-scope="scope">
          <span>{{ checkApplyStatusBackCardNo(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="backCardName" label="所属银行">
        <template slot-scope="scope">
          <span>{{ checkApplyStatusBackCardName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanCardNo" label="放款卡">
        <template slot-scope="scope">
          <span>{{ checkApplyStatusLoanCardNo(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanCardName" label="所属银行">
        <template slot-scope="scope">
          <span>{{ checkApplyStatusLoanCardName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请日期">
        <template slot-scope="scope">
          <span>{{ time(scope.row.applyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanTime" label="放款日期">
        <template slot-scope="scope" >
          <span>{{ checkApplyStatusTime(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看订单详情" placement="top-start">
            <el-button type="success" size="mini" @click="getRepay(scope.row)">详情</el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="点击查看还款计划" placement="top-start">
            <el-button type="success" size="mini" @click="getRepay(scope.row)">还款</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '../../../mixins/initData'
import { getRoleTree } from '@/api/role'
import { parseTime } from '@/utils/index'
import search from './module/search'
export default {
  components: { search },
  mixins: [initData],
  data() {
    return {
      roles: [], delLoading: false, sup_this: this
    }
  },
  created() {
    this.getRoles()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/apply'
      const sort = 'applyTime,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const applyStatus = query.enabled
      const loanChannel = query.channel
      this.params = { page: this.page, size: this.size, sort: sort }
      if (type && value) { this.params[type] = value }
      if (applyStatus !== '' && applyStatus !== null) { this.params['applyStatus'] = applyStatus }
      if (loanChannel !== '' && loanChannel !== null) { this.params['loanChannel'] = loanChannel }
      const time = query.time
      if (time !== undefined && time !== '' && time !== null) {
        this.params['beginDate'] = time[0]
        this.params['endDate'] = time[1]
      }
      return true
    },
    time(time) {
      return parseTime(time)
    },
    getRoles() {
      getRoleTree().then(res => {
        this.roles = res
      })
    },
    getRepay(row) {
      this.$router.push({
        path: '/loan/repay/',
        query: { rows: row }
      })
    },
    formatStatus(status) {
      if (status === '1') {
        return '审核中'
      } else if (status === '2') {
        return '审批拒绝'
      } else if (status === '3') {
        return '待收款'
      } else if (status === '4') {
        return '拒绝收款'
      } else if (status === '5') {
        return '确认收款'
      } else if (status === '6') {
        return '待放款'
      } else if (status === '7') {
        return '还款中'
      } else if (status === '8') {
        return '还款完成'
      } else if (status === '9') {
        return '逾期'
      } else if (status === '10') {
        return '放款失败'
      }
    },
    formatChannel(channel) {
      if (channel === 'LCC201709190001') {
        return '新网'
      } else if (channel === 'LCC201709190002') {
        return '众安'
      } else if (channel === 'LCC201709190003') {
        return 'mock'
      } else if (channel === 'LCC201709190004') {
        return '合利宝'
      } else if (channel === 'LCC201709190005') {
        return '京东'
      } else if (channel === 'LCC201709190006') {
        return '龙信'
      } else if (channel === 'LCC201709190007') {
        return '微商'
      } else if (channel === 'LCC201709190008') {
        return '微言'
      } else if (channel === 'LCC201709190009') {
        return '光大'
      } else if (channel === 'LCC201709190010') {
        return '晋商'
      }
    },
    checkApplyStatusTime(row) {
      if (row.applyStatus === '7' || row.applyStatus === '8' || row.applyStatus === '9') { return this.time(row.loanControlOrderEntity.loanTime) }
    },
    checkApplyStatusAmount(row) {
      if (row.applyStatus === '7' || row.applyStatus === '8' || row.applyStatus === '9') { return row.loanControlOrderEntity.loanAmount / 100 }
    },
    checkApplyStatusBackCardNo(row) {
      if (row.bankCardId !== '' && row.bankCardId !== null) {
        return row.backAccountUserCardEntity.bankCardNo
      }
    },
    checkApplyStatusBackCardName(row) {
      if (row.bankCardId !== '' && row.bankCardId !== null) {
        return row.backAccountUserCardEntity.bankName
      }
    },
    checkApplyStatusLoanCardNo(row) {
      if (row.loanCardId !== '' && row.loanCardId !== null) {
        return row.loanAccountUserCardEntity.bankCardNo
      }
    },
    checkApplyStatusLoanCardName(row) {
      if (row.loanCardId !== '' && row.loanCardId !== null) {
        return row.loanAccountUserCardEntity.bankName
      }
    }
  }
}
</script>

<style scoped>

</style>
