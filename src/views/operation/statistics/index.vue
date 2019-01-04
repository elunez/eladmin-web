<template>
  <div class="app-container">
    <search :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="time" label="时间">
        <template slot-scope="scope">
          <span>{{ times(scope.row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="registernNum" label="注册数">
        <template slot-scope="scope">
          <span>{{ scope.row.registernNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请数">
        <template slot-scope="scope">
          <span>{{ scope.row.applyNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyNum" label="申请金额">
        <template slot-scope="scope">
          <span>{{ scope.row.applyAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creditNum" label="授信数">
        <template slot-scope="scope">
          <span>{{ scope.row.creditNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creditNum" label="授信金额">
        <template slot-scope="scope">
          <span>{{ scope.row.creditAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanNum" label="放款数">
        <template slot-scope="scope">
          <span>{{ scope.row.loanNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanNum" label="放款金额">
        <template slot-scope="scope">
          <span>{{ scope.row.loanAmount }}</span>
        </template>
      </el-table-column>
    </el-table>
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
      this.url = 'api/statistics'
      const query = this.query
      const time = query.time
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
