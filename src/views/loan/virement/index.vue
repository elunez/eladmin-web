<template>
  <div class="app-container">
    <search :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="还款编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyId" label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.applyId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="termNo" label="还款期数">
        <template slot-scope="scope">
          <span>{{ scope.row.termNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="还款状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planRepayTime" label="应还款时间">
        <template slot-scope="scope">
          <span>{{ time(scope.row.planRepayTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planPrincipalAmount" label="应还款本金">
        <template slot-scope="scope">
          <span>{{ scope.row.planPrincipalAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="planInterestAmount" label="应还款利息">
        <template slot-scope="scope">
          <span>{{ scope.row.planInterestAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceAmount" label="应还服务费">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualRepayTime" label="实还款时间">
        <template slot-scope="scope">
          <span>{{ time(scope.row.actualRepayTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualPrincipalAmount" label="实还款本金">
        <template slot-scope="scope">
          <span>{{ scope.row.actualPrincipalAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualInterestAmount" label="实还款利息">
        <template slot-scope="scope">
          <span>{{ scope.row.actualInterestAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualServiceAmount" label="实还服务费">
        <template slot-scope="scope">
          <span>{{ scope.row.actualServiceAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" >查看详情</el-button>
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
      this.url = 'api/repay'
      const sort = 'id'
      const query = this.query
      const type = query.type
      const value = query.value
      const status = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort }
      if (type && value) { this.params[type] = value }
      if (status !== '' && status !== null) { this.params['status'] = status }
      if (undefined !== this.$route.query.rows) {
        const applyId = this.$route.query.rows.id
        if (applyId !== '' && applyId !== null) { this.params['applyId'] = applyId }
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
    }
  }
}
</script>

<style scoped>

</style>
