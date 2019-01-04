<template>
  <div class="app-container">
    <search :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="用户编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="certificationStatus" label="实名认证">
        <template slot-scope="scope">
          <span>{{ scope.row.certificationStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="indentityNo" label="证件号">
        <template slot-scope="scope">
          <span>{{ scope.row.indentityNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="注册时间">
        <template slot-scope="scope">
          <span>{{ time(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看用户详情" placement="top-start">
            <el-button type="success" size="mini" @click="getRepay(scope.row)">详情</el-button>
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
      this.url = 'api/userInfo'
      const sort = 'createDate,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const certificationStatus = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort }
      if (type && value) { this.params[type] = value }
      if (certificationStatus !== '' && certificationStatus !== null) { this.params['certificationStatus'] = certificationStatus }
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
    }
  }
}
</script>

<style scoped>

</style>
