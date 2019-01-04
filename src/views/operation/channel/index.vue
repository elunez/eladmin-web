<template>
  <div class="app-container">
    <search :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="渠道编号">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="displayName" label="渠道名称">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="registernNum" label="注册数">
        <template slot-scope="scope">
          <span>{{ scope.row.statisticsDTO.registernNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请数">
        <template slot-scope="scope">
          <span>{{ scope.row.statisticsDTO.applyNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="申请金额">
        <template slot-scope="scope">
          <span>{{ scope.row.statisticsDTO.applyAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creditNum" label="授信数">
        <template slot-scope="scope">
          <span>{{ scope.row.statisticsDTO.creditNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creditAmount" label="授信金额">
        <template slot-scope="scope">
          <span>{{ scope.row.statisticsDTO.creditAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanNum" label="放款数">
        <template slot-scope="scope">
          <span>{{ scope.row.statisticsDTO.loanNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanAmount" label="放款金额">
        <template slot-scope="scope">
          <span>{{ scope.row.statisticsDTO.loanAmount }}</span>
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
      this.url = 'api/channelStatistics'
      const query = this.query
      const sort = 'id'
      const time = query.time
      const type = query.type
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (type && value) { this.params[type] = value }
      if (time !== undefined && time !== '' && time !== null) {
        this.params['beginDate'] = time[0]
        this.params['endDate'] = time[1]
      }
      return true
    },
    times(time) {
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
