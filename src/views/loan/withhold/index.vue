<template>
  <div class="app-container">
    <search :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="扣款编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyId" label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.applyId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="repayId" label="还款编号">
        <template slot-scope="scope">
          <span>{{ scope.row.repayId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="virementStatusMessage" label="状态描述">
        <template slot-scope="scope">
          <span>{{ scope.row.virementStatusMessage }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="virementDesc" label="类型描述">
        <template slot-scope="scope">
          <span>{{ scope.row.virementDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="virementAmount" label="实扣金额">
        <template slot-scope="scope">
          <span>{{ scope.row.virementAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="principalAmount" label="应扣本金">
        <template slot-scope="scope">
          <span>{{ scope.row.principalAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="interestAmount" label="应扣利息">
        <template slot-scope="scope">
          <span>{{ scope.row.interestAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceAmount" label="应扣服务费">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="penaltyAmount" label="应扣罚息">
        <template slot-scope="scope">
          <span>{{ scope.row.penaltyAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discountAmount" label="优惠金额">
        <template slot-scope="scope">
          <span>{{ scope.row.discountAmount/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="virementTime" label="扣款时间">
        <template slot-scope="scope">
          <span>{{ time(scope.row.virementTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="visible()">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogRepayVisible" title="扣款详情" >
      <div>
        <el-input v-model="creditAmount" placeholder="例：88888888" clearable />
      </div>
    </el-dialog>
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
      roles: [], delLoading: false, sup_this: this, dialogRepayVisible: false
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
      this.url = 'api/withhold'
      const sort = 'createTime,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const virementStatus = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort }
      if (type && value) { this.params[type] = value }
      if (virementStatus !== '' && virementStatus !== null) { this.params['virementStatus'] = virementStatus }
      if (undefined !== this.$route.query.rows) {
        const applyId = this.$route.query.rows.id
        if (applyId !== '' && applyId !== null) { this.params['applyId'] = applyId }
      }
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
    visible() {
      this.dialogRepayVisible = true
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
