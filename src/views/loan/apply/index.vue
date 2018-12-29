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
      <el-table-column prop="applyStatus" label="订单状态">
        <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.applyStatus) }}</span>
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
      <el-table-column prop="createTime" label="申请日期">
        <template slot-scope="scope">
          <span>{{ time(scope.row.applyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="getRepay(scope.row)">查看详情</el-button>
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
      this.params = { page: this.page, size: this.size, sort: sort }
      if (type && value) { this.params[type] = value }
      if (applyStatus !== '' && applyStatus !== null) { this.params['applyStatus'] = applyStatus }
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
        return '审批通过|待收款'
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
    }
  }
}
</script>

<style scoped>

</style>
