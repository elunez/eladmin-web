<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="query.filter" clearable size="small" placeholder="全表模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 导出 -->
      <el-button
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="downloadMethod"
      >导出</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="job" label="岗位" />
      <el-table-column prop="ip" label="登录IP" />
      <el-table-column :show-overflow-tooltip="true" prop="address" label="登录地点" />
      <el-table-column prop="browser" label="浏览器" />
      <el-table-column prop="loginTime" label="登录时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.$index"
            v-permission="['admin']"
            placement="top"
            width="180"
          >
            <p>确定踢出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.key, scope.$index)">确定</el-button>
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
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import { del } from '@/api/monitor/online'
export default {
  name: 'OnlineUser',
  mixins: [crud],
  data() {
    return {
      title: '在线用户',
      crudMethod: { del }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'auth/online'
      return true
    },
    // 踢出用户
    delMethod(key, index) {
      this.delLoading = true
      this.crudMethod.del(key).then(() => {
        this.delLoading = false
        this.$refs[index].doClose()
        this.dleChangePage()
        this.notify('踢出成功', 'success')
        this.init()
      }).catch(() => {
        this.delLoading = false
        this.$refs[index].doClose()
      })
    }
  }
}
</script>
