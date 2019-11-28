<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.blurry" clearable placeholder="输入搜索内容" style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%">
      <el-table-column prop="appName" label="应用名称" />
      <el-table-column prop="ip" label="部署IP" />
      <el-table-column prop="deployDate" label="部署时间" />
      <el-table-column prop="deployUser" label="部署人员" />
      <el-table-column v-if="checkPermission(['admin','deployHistory:del'])" label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','deployHistory:del']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import { del } from '@/api/mnt/deployHistory'

export default {
  mixins: [crud],
  data() {
    return {
      title: '部署历史',
      crudMethod: { del }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/deployHistory'
      return true
    }
  }
}
</script>

<style scoped>
</style>
