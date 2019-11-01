<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="query.value" clearable placeholder="全表模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="userName" label="用户名"/>
      <el-table-column prop="job" label="岗位"/>
      <el-table-column prop="ip" label="登录IP"/>
      <el-table-column :show-overflow-tooltip="true" prop="address" label="登录地点"/>
      <el-table-column prop="browser" label="浏览器"/>
      <el-table-column prop="loginTime" label="登录时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            v-permission="['admin']"
            :ref="scope.$index"
            placement="top"
            width="180">
            <p>确定踢出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row.key)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">踢出</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime, downloadFile } from '@/utils/index'
import { del, downloadOnline } from '@/api/online'
export default {
  name: 'OnlineUser',
  mixins: [initData],
  data() {
    return {
      delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    beforeInit() {
      this.url = 'auth/online'
      this.params = { page: this.page, size: this.size }
      if (this.query.value) { this.params['filter'] = this.query.value }
      return true
    },
    subDelete(index, key) {
      this.delLoading = true
      del(key).then(res => {
        this.delLoading = false
        this.$refs[index].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '踢出成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[index].doClose()
        console.log(err.response.data.message)
      })
    },
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadOnline(this.params).then(result => {
        downloadFile(result, '在线用户列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>
